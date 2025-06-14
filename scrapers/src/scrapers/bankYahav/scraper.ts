/**
 * Bank Yahav Scraper
 *
 * This module implements a Playwright test that scrapes transaction data from Bank Yahav's website.
 * It logs in to the bank's website, navigates to the transactions page, and iterates through
 * transaction history, downloading and processing transactions for storage in the system.
 *
 * The scraper handles both regular account transactions and debit card transactions,
 * and can initialize account balance if needed.
 */

import { test } from "@playwright/test"
import { Site } from "./site.ts"
import { client } from "../../util/client.ts"
import { bankYahavConfig } from "./config.ts"
import { AccountTransaction } from "./account-transaction.ts"
import { AccountTransactionsPage } from "./account-transactions-page.ts"
import { BalanceTransaction } from "./balance-transaction.ts"
import { ITransaction, saveTransaction } from "./transaction.ts"
import { gql } from "../../graphql"
import { generalConfig } from "../../util/general-config.ts"
import { getLastSuccessfulScrapedDate, setLastSuccessfulScrapedDate } from "../../util/state.ts"
import { DateTime } from "luxon"

/**
 * Query to get a summary of transactions for a tenant
 *
 * Retrieves the total number of transactions for the specified tenant.
 *
 * @param {ID!} tenantID - The ID of the tenant to query
 * @returns {Object} An object containing the total number of transactions
 */
export const GetTransactionsSummary = gql(`
    query GetTransactionsCount($tenantID: ID!) {
        tenant(id: $tenantID) {
            totalTransactions
        }
    }
`)

/**
 * Scraper for the Bank Yahav website.
 *
 * This test performs the following operations:
 * 1. Retrieves configuration and authentication details
 * 2. Gets current transaction summary from the GraphQL API
 * 3. Logs into the Bank Yahav website
 * 4. Navigates to and scrapes transaction data, moving backward through history
 * 5. Creates initialization transaction if needed
 * 6. Processes both regular and debit card transactions
 * 7. Saves all transactions to the system
 */
test("scrape", async ({ page }) => {
    const tenantID  = generalConfig.tenantID
    const accountID = bankYahavConfig.accountID
    const username  = bankYahavConfig.username
    const password  = bankYahavConfig.password
    const pinno     = bankYahavConfig.pinno

    const lastSuccessfulScrapedDateResult = await getLastSuccessfulScrapedDate()
    console.info(`Last successfully scraped date is: ${lastSuccessfulScrapedDateResult?.toLocaleString()}`)

    const yesterday: DateTime = DateTime.now().minus({ days: 1 }).startOf("day")
    let startDate: DateTime
    if (!lastSuccessfulScrapedDateResult) {
        startDate = DateTime.now().minus({ months: 6 }).plus({ day: 1 }).startOf("day")
    } else if (lastSuccessfulScrapedDateResult.startOf("day").equals(yesterday)) {
        console.info(`Already fully scraped until yesterday (inclusive), nothing to do.`)
        return
    } else {
        startDate = lastSuccessfulScrapedDateResult.plus({ days: 1 }).startOf("day")
    }
    let endDate = startDate.endOf("month").endOf("day")
    if (endDate.diff(yesterday, "seconds").seconds > 0) {
        endDate = yesterday.endOf("day")
    }

    console.info(`Scraping transactions of account ${accountID} in tenant ${tenantID} from ${startDate.toLocaleString()} to ${endDate.toLocaleString()}`)

    const txSummaryResult = await client.query(GetTransactionsSummary, { tenantID })
    if (txSummaryResult.error) {
        throw new Error(`Failed to get transactions summary for tenant ${tenantID}: ${txSummaryResult.error.message}`)
    }
    const totalTransactions: number = txSummaryResult.data!.tenant!.totalTransactions

    // if (1==1) {
    //     await page.goto("https://www.google.com/")
    //     await page.waitForLoadState("networkidle")
    //     await new Promise(resolve => setTimeout(resolve, 1000))
    //     await page.goto("https://www.microsoft.com/")
    //     await page.waitForLoadState("networkidle")
    //     await new Promise(resolve => setTimeout(resolve, 1000))
    //     return
    // }

    // Open the site and login
    const site = new Site(page, tenantID, accountID, username, password, pinno)
    await site.open()
    await site.login()

    // Navigate to the transactions page
    const txPage: AccountTransactionsPage = await site.openTransactionsPage()
    await txPage.setDateRange(startDate, endDate)

    if (bankYahavConfig.downloadXLS) {
        await txPage.downloadTransactionsExcel()
    }

    const transactions: ITransaction[] = []

    // Scrape account-level transactions from the current date range
    const accountTransactions = await txPage.getTransactions()

    // If found at least one account-level transaction, and the tenant currently has no transactions, then this is
    // essentially the first transaction ever of this tenant; thus, given that account-level transactions also provide
    // the resulting account balance, we can infer what was the account balance before that first transaction; therefore
    // we will add a balance initialization transaction first.
    if (accountTransactions.length > 0 && totalTransactions == 0) {
        console.debug(`Found transactions for a tenant with no transactions - populating a balance initialization transaction.`)

        const firstTx: AccountTransaction = accountTransactions[0]
        const balanceBeforeTx: number     = await firstTx.getBalanceBeforeTransaction()
        const balanceTx                   = new BalanceTransaction(
            (await firstTx.getDate()).minus({ days: 7 }),
            "initialization",
            "Balance initialization",
            balanceBeforeTx < 0 ? Math.abs(balanceBeforeTx) : null,
            balanceBeforeTx > 0 ? Math.abs(balanceBeforeTx) : null,
        )
        transactions.push(balanceTx)
    }

    // Iterate over all account-level transactions and add each one:
    //  - If it's a debit-card aggregate transaction, navigate to the page showing its underlying transactions behind it
    //    and add each such underlying transaction to the final list of transactions
    //  - Otherwise, add the account-level transaction to the final list of transactions
    for (let accountTx of accountTransactions) {
        if (await accountTx.isDebitCardTransaction()) {
            console.info(`Processing debit card aggregate transaction: ${await accountTx.toDebugString()}`)
            const debitCardTxPage = await accountTx.navigateToDebitCardTransactions()
            if (bankYahavConfig.downloadXLS) {
                await debitCardTxPage.downloadTransactionsExcel()
            }
            transactions.push(...await debitCardTxPage.getTransactions())
            await debitCardTxPage.close()
            await txPage.awaitUntilVisible()
        } else {
            console.info(`Processing account transaction: ${await accountTx.toDebugString()}`)
            transactions.push(accountTx)
        }
    }

    // Sort transactions based on date
    console.debug(`Sorting transactions by date...`)
    const transactionsWithDates = await Promise.all(
        transactions.map(async (tx) => ({ tx, date: await tx.getDate() })),
    )
    const sortedTransactions    = transactionsWithDates
        .sort((a, b) => a.date.valueOf() - b.date.valueOf())
        .map(item => item.tx)

    // Save the resulting full list of transactions that contains:
    // - Optional balance initialization transaction
    // - Account-level transactions
    // - Debit-card underlying transactions
    for (let i = 0; i < sortedTransactions.length; i++) {
        await saveTransaction(tenantID, accountID, sortedTransactions[i], i)
    }

    await site.logout()

    await setLastSuccessfulScrapedDate(await sortedTransactions[sortedTransactions.length - 1].getDate())
})

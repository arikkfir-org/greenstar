import { expect, Locator } from "@playwright/test"
import { AccountTransaction } from "./account-transaction.ts"
import { DebitCardTransaction } from "./debit-card-transaction.ts"

/**
 * Represents the debit card transactions page in the Bank Yahav website.
 *
 * This class provides methods to interact with the debit card transactions popup,
 * download transaction data, and extract individual card charges.
 */
export class DebitCardTransactionsPage {
    /** Locator for the close button of the popup */
    private readonly closeButtonLocator: Locator

    /** Locator for the transaction rows in the table */
    private readonly transactionRowsLocator: Locator

    /** Locator for the Excel download icon */
    private readonly xlsDownloadIconLocator: Locator

    private readonly spinnerLocator: Locator

    /**
     * Creates a new DebitCardTransactionsPage instance
     *
     * @param {AccountTransaction} accountTransaction - The parent account transaction
     */
    constructor(private readonly accountTransaction: AccountTransaction) {
        const page                  = this.accountTransaction.accountTransactionsPage.page
        this.closeButtonLocator     = page.locator(
            "div#debit-card-transaction-container div#export-debit-card-transaction-list button.btn-primary")
        this.transactionRowsLocator = page.locator(`div.statement > div.item-holder > div[role=row]`)
        this.xlsDownloadIconLocator = page.locator(`div.export-options-lft-content > div.export-options-cell > a > i.icon.xls`)
        this.spinnerLocator         = page.locator(`div.loading-bar-spinner`)
    }

    /**
     * Waits until the page is fully loaded and visible
     *
     * Uses the close button and Excel download icon as indicators that the popup has loaded
     */
    async awaitUntilVisible() {
        await expect(this.closeButtonLocator).toBeVisible()
        await expect(this.xlsDownloadIconLocator).toBeVisible()
        await expect(this.spinnerLocator).toHaveCount(0)
    }

    /**
     * Closes the debit card transactions popup
     *
     * Clicks the close button to return to the main transactions page
     */
    async close() {
        await this.closeButtonLocator.click()
        await this.accountTransaction.accountTransactionsPage.page.waitForLoadState("networkidle")
        await expect(this.spinnerLocator).toHaveCount(0)
    }

    /**
     * Downloads the debit card transactions as an Excel file
     *
     * Creates a filename based on the parent transaction's reference ID and saves the downloaded file
     */
    async downloadTransactionsExcel() {
        console.debug(`Downloading debit card transactions as Excel file...`)
        const xlsDownloadPromise = this.accountTransaction.accountTransactionsPage.page.waitForEvent("download")
        await this.xlsDownloadIconLocator.click()
        const xlsDownload   = await xlsDownloadPromise
        const parentTxRefID = await this.accountTransaction.getReferenceID()
        const parentTxDate  = (await this.accountTransaction.getDate()).toFormat("yyyy-MM-dd")
        const random        = Math.round(Math.random() * 10)
        await xlsDownload.saveAs(`./debit-transactions-${parentTxDate}-${parentTxRefID}-${random}.xls`)
    }

    /**
     * Gets all debit card transactions displayed on the current page
     *
     * Creates DebitCardTransaction objects for each row in the transactions table
     *
     * @returns {Promise<DebitCardTransaction[]>} Array of debit card transactions
     */
    async getTransactions(): Promise<DebitCardTransaction[]> {
        console.debug(`Fetching debit card transactions from the debit card transactions page...`)
        const rowLocators: Locator[]               = await this.transactionRowsLocator.all()
        const transactions: DebitCardTransaction[] = []
        for (let i = rowLocators.length - 1; i >= 0; i--) {
            const rowLocator = rowLocators[i]
            const tx         = new DebitCardTransaction(this.accountTransaction, rowLocator)
            await tx.init()
            transactions.push(tx)
        }
        console.debug(`Found ${transactions.length} transactions.`)
        return transactions
    }
}

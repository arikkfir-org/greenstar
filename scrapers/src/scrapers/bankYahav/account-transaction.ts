import { BaseTransaction } from "./base-transaction.ts"
import { getDateFromLocator, ITransaction } from "./transaction.ts"
import { Locator } from "@playwright/test"
import { DateTime } from "luxon"
import { AccountTransactionsPage } from "./account-transactions-page.ts"
import { DebitCardTransactionsPage } from "./debit-card-transactions-page.ts"

/**
 * Represents an account-level transaction shown in the account's checking account transactions page.
 *
 * This class handles parsing and processing of regular account transactions from the main
 * transactions page. It can also detect and navigate to debit card transactions.
 */
export class AccountTransaction extends BaseTransaction implements ITransaction {

    /** Locator for the date column */
    private readonly dateLocator: Locator
    private date: DateTime | undefined

    /** Locator for the reference ID column */
    private readonly referenceIDLocator: Locator
    private referenceID: string | undefined

    /** Locator for the description column */
    private readonly descriptionLocator: Locator
    private description: string | undefined

    /** Locator for the debit card icon (if present) */
    private readonly debitCardIconLocator: Locator

    /** Locator for the debit amount column */
    private readonly debitLocator: Locator
    private debit: number | null | undefined

    /** Locator for the credit amount column */
    private readonly creditLocator: Locator
    private credit: number | null | undefined

    /** Locator for the balance column */
    private readonly balanceLocator: Locator
    private balance: number | undefined

    private debitCardTransaction: boolean | undefined

    constructor(
        public readonly accountTransactionsPage: AccountTransactionsPage,
        readonly rowLocator: Locator,
    ) {
        super(rowLocator)
        this.dateLocator          = this.rowColumnsLocator.nth(0).locator("> span")
        this.referenceIDLocator   = this.rowColumnsLocator.nth(1).locator("> span")
        this.descriptionLocator   = this.rowColumnsLocator.nth(2).locator("> span:not(.icon)")
        this.debitCardIconLocator = this.rowColumnsLocator.nth(2).locator("> span.icon.debitcard[role=button]")
        this.debitLocator         = this.rowColumnsLocator.nth(3).locator("> span")
        this.creditLocator        = this.rowColumnsLocator.nth(4).locator("> span")
        this.balanceLocator       = this.rowColumnsLocator.nth(5).locator("> div > span:not(.icon)")
    }

    async init() {
        await super.init()
        await this.getBalance()
        await this.getBalanceBeforeTransaction()
        await this.isDebitCardTransaction()
    }

    /**
     * Gets the transaction date
     * @returns {Promise<DateTime>} The transaction date
     */
    async getDate(): Promise<DateTime> {
        if (this.date === undefined) {
            this.date = await getDateFromLocator(this.dateLocator)
        }
        return this.date
    }

    /**
     * Gets the transaction reference ID
     * @returns {Promise<string>} The transaction reference ID
     */
    async getReferenceID(): Promise<string> {
        if (this.referenceID === undefined) {
            this.referenceID = (await this.referenceIDLocator.count() == 0)
                ? ""
                : await this.referenceIDLocator.innerText() || ""
        }
        return this.referenceID
    }

    /**
     * Gets the transaction description
     * @returns {Promise<string>} The transaction description
     */
    async getDescription(): Promise<string> {
        if (this.description === undefined) {
            this.description = (await this.descriptionLocator.count() == 0)
                ? ""
                : await this.descriptionLocator.innerText() || ""
        }
        return this.description
    }

    /**
     * Gets the debit amount (money withdrawn)
     * Parses the text value from the debit column and converts it to a number
     *
     * @returns {Promise<number>} The debit amount or 0 if not applicable
     */
    async getDebit(): Promise<number | null> {
        if (this.debit === undefined) {
            this.debit = (await this.debitLocator.count() == 0)
                ? null
                : parseFloat((await this.debitLocator.innerText()).replace(/,/g, "").trim())
        }
        return this.debit
    }

    /**
     * Gets the credit amount (money deposited)
     * Parses the text value from the credit column and converts it to a number
     *
     * @returns {Promise<number>} The credit amount or 0 if not applicable
     */
    async getCredit(): Promise<number | null> {
        if (this.credit === undefined) {
            this.credit = (await this.creditLocator.count() == 0)
                ? null
                : parseFloat((await this.creditLocator.innerText()).replace(/,/g, "").trim())
        }
        return this.credit
    }

    /**
     * Gets the account balance after this transaction
     * Parses the text value from the balance column and converts it to a number
     *
     * @returns {Promise<number>} The account balance
     */
    async getBalance(): Promise<number> {
        if (this.balance === undefined) {
            if (await this.balanceLocator.count() == 0) {
                throw new Error(`Transaction has no balance: ${await this.toDebugString()}`)
            }
            this.balance = parseFloat((await this.balanceLocator.innerText()).replace(/,/g, "").trim())
        }
        return this.balance
    }

    /**
     * Calculates the account balance before this transaction
     *
     * For debit transactions, adds the debit amount to the current balance.
     * For credit transactions, subtracts the credit amount from the current balance.
     *
     * @returns {Promise<number>} The account balance before this transaction
     * @throws {Error} If neither debit nor credit values are available
     */
    async getBalanceBeforeTransaction(): Promise<number> {
        const debit                   = await this.getDebit()
        const credit                  = await this.getCredit()
        const balanceAfterTransaction = await this.getBalance()
        if (debit) {
            return balanceAfterTransaction + debit
        } else if (credit) {
            return balanceAfterTransaction - credit
        } else {
            throw new Error(`Could not calculate balance before this transaction - missing both debit and credit (${await this.toDebugString()})`)
        }
    }

    /**
     * Checks if this transaction is a debit card transaction
     *
     * Debit card transactions have a special icon and can be expanded to show individual card charges
     *
     * @returns {Promise<boolean>} True if this is a debit card transaction
     */
    async isDebitCardTransaction(): Promise<boolean> {
        if (this.debitCardTransaction === undefined) {
            this.debitCardTransaction = await this.debitCardIconLocator.count() > 0
        }
        return this.debitCardTransaction
    }

    /**
     * Navigates to the debit card transactions page for this transaction
     *
     * Clicks on the debit card icon and waits for the debit card transactions page to load
     *
     * @returns {Promise<DebitCardTransactionsPage>} The debit card transactions page
     */
    async navigateToDebitCardTransactions(): Promise<DebitCardTransactionsPage> {
        if (!await this.isDebitCardTransaction()) {
            throw new Error(`Transaction ${await this.toDebugString()} is not a debit card transaction`)
        }

        console.debug(`Opening debit card transactions page for transaction: ${await this.toDebugString()}`)

        await this.debitCardIconLocator.click()

        const debitCardTransactionsPage = new DebitCardTransactionsPage(this)
        await debitCardTransactionsPage.awaitUntilVisible()
        return debitCardTransactionsPage
    }

    /**
     * Generates a debug string with all transaction details
     *
     * Useful for logging and error reporting.
     *
     * @returns {Promise<string>} A string containing all transaction details
     */
    async toDebugString(): Promise<string> {
        const date: DateTime              = await this.getDate()
        const referenceID: string         = await this.getReferenceID()
        const description: string         = await this.getDescription()
        const debit: (number | null)      = await this.getDebit()
        const credit: (number | null)     = await this.getCredit()
        const balance: string | undefined = (await this.balanceLocator.count() > 0)
            ? await this.balanceLocator.innerText()
            : "MISSING"
        return `AccountTransaction { date=${date.toISO()}, ref=${referenceID}, desc=${description}, debit=${debit}, credit=${credit}, balance=${balance} }`
    }
}

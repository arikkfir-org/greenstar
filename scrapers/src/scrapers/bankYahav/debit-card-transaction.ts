import { BaseTransaction } from "./base-transaction.ts"
import { getDateFromLocator, ITransaction } from "./transaction.ts"
import { Locator } from "@playwright/test"
import { AccountTransaction } from "./account-transaction.ts"
import { DateTime } from "luxon"

/**
 * Represents a debit card transaction shown in the debit card transactions page.
 *
 * This class handles parsing and processing of individual debit card transactions
 * that are accessed by expanding a debit card account transaction.
 */
export class DebitCardTransaction extends BaseTransaction implements ITransaction {
    /** Locator for the date column */
    private readonly dateLocator: Locator
    private date: DateTime | undefined

    /** Locator for the transaction number/reference column */
    private readonly transactionNumberLocator: Locator
    private referenceID: string | undefined

    /** Locator for the description column */
    private readonly descriptionLocator: Locator
    private description: string | undefined

    /** Locator for the debit amount column */
    private readonly debitLocator: Locator
    private debit: number | null | undefined

    /** Locator for the credit amount column */
    private readonly creditLocator: Locator
    private credit: number | null | undefined

    constructor(
        public readonly parentTransaction: AccountTransaction,
        protected readonly rowLocator: Locator,
    ) {
        super(rowLocator)
        this.dateLocator              = this.rowColumnsLocator.nth(0).locator("> span")
        this.descriptionLocator       = this.rowColumnsLocator.nth(1).locator("> span")
        this.transactionNumberLocator = this.rowColumnsLocator.nth(2).locator("> span")
        this.debitLocator             = this.rowColumnsLocator.nth(5).locator("> span")
        this.creditLocator            = this.rowColumnsLocator.nth(6).locator("> span")
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
     *
     * Combines the parent transaction's reference ID with this transaction's number
     * to create a unique identifier.
     *
     * @returns {Promise<string>} The combined reference ID
     */
    async getReferenceID(): Promise<string> {
        if (this.referenceID === undefined) {
            const parentReferenceID = await this.parentTransaction.getReferenceID()
            const transactionNumber = (await this.transactionNumberLocator.count() == 0)
                ? Math.random()
                : Number(await this.transactionNumberLocator.innerText())
            this.referenceID        = `${parentReferenceID}/${transactionNumber}`
        }
        return this.referenceID
    }

    /**
     * Gets the transaction description
     *
     * Combines the parent transaction's description with this transaction's description
     * to provide context about both the debit card charge and the specific purchase.
     *
     * @returns {Promise<string>} The combined description
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
     * Generates a debug string with all transaction details
     *
     * Useful for logging and error reporting.
     *
     * @returns {Promise<string>} A string containing all transaction details
     */
    async toDebugString(): Promise<string> {
        const date: DateTime          = await this.getDate()
        const referenceID: string     = await this.getReferenceID()
        const description: string     = await this.getDescription()
        const debit: (number | null)  = await this.getDebit()
        const credit: (number | null) = await this.getCredit()
        return `DebitCardTransaction { date=${date.toISO()}, ref=${referenceID}, desc=${description}, debit=${debit}, credit=${credit} }`
    }
}

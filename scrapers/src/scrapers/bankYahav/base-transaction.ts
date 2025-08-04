import { ITransaction } from "./transaction.ts"
import { Locator } from "@playwright/test"
import { DateTime } from "luxon"

/**
 * Abstract base class that provides a foundation & shared functionality for different transaction implementations.
 * Handles common operations like saving transactions and calculating amounts.
 */
export abstract class BaseTransaction implements ITransaction {

    /** Locator for the columns within this transaction row */
    protected readonly rowColumnsLocator: Locator

    protected constructor(protected readonly rowLocator: Locator) {
        this.rowColumnsLocator = this.rowLocator.locator("> div.col")
    }

    async init() {
        await this.getDate()
        await this.getReferenceID()
        await this.getDescription()
        await this.getDebit()
        await this.getCredit()
    }

    /**
     * Generates a debug string with all transaction details
     *
     * Useful for logging and error reporting.
     *
     * @returns {Promise<string>} A string containing all transaction details
     */
    abstract toDebugString(): Promise<string>

    /**
     * Gets the transaction date
     * @returns {Promise<DateTime>} The transaction date
     */
    abstract getDate(): Promise<DateTime>

    /**
     * Gets the transaction reference ID
     * @returns {Promise<string>} The transaction reference ID
     */
    abstract getReferenceID(): Promise<string>

    /**
     * Gets the transaction description
     * @returns {Promise<string>} The transaction description
     */
    abstract getDescription(): Promise<string>

    /**
     * Gets the debit amount (money withdrawn)
     * @returns {Promise<number|null>} The debit amount or null
     */
    abstract getDebit(): Promise<number | null>

    /**
     * Gets the credit amount (money deposited)
     * @returns {Promise<number|null>} The credit amount or null
     */
    abstract getCredit(): Promise<number | null>
}

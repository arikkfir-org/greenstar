import { ITransaction } from "./transaction.ts"
import { DateTime } from "luxon"

export class BalanceTransaction implements ITransaction {

    constructor(
        public readonly date: DateTime,
        public readonly referenceID: string,
        public readonly description: string,
        public readonly debit: number | null,
        public readonly credit: number | null,
    ) {
    }

    /**
     * Gets the transaction date
     * @returns {Promise<DateTime>} The transaction date
     */
    async getDate(): Promise<DateTime> {
        return this.date
    }

    /**
     * Gets the transaction reference ID
     * @returns {Promise<string>} The transaction reference ID
     */
    async getReferenceID(): Promise<string> {
        return this.referenceID
    }

    /**
     * Gets the transaction description
     * @returns {Promise<string>} The transaction description
     */
    async getDescription(): Promise<string> {
        return this.description
    }

    /**
     * Gets the debit amount (money withdrawn)
     * Parses the text value from the debit column and converts it to a number
     *
     * @returns {Promise<number>} The debit amount or 0 if not applicable
     */
    async getDebit(): Promise<number | null> {
        return this.debit
    }

    /**
     * Gets the credit amount (money deposited)
     * Parses the text value from the credit column and converts it to a number
     *
     * @returns {Promise<number>} The credit amount or 0 if not applicable
     */
    async getCredit(): Promise<number | null> {
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
        return `BalanceTransaction { date=${date.toISO()}, ref=${referenceID}, desc=${description}, debit=${debit}, credit=${credit} }`
    }
}

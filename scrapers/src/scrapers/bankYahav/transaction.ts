import { DateTime } from "luxon"
import { client } from "../../util/client.ts"
import { gql } from "../../graphql"
import { Locator } from "@playwright/test"

/**
 * Mutation to create a new transaction
 *
 * Creates a new transaction in the system with the provided transaction data.
 *
 * @param {CreateTransaction!} tx - The transaction data to create
 * @returns {Object} The created transaction with its ID
 */
export const CreateTransaction = gql(`
    mutation CreateTransaction($tx: CreateTransaction!) {
        createTransaction(tx: $tx) {
            id
        }
    }
`)

/**
 * Represents a financial transaction with methods to access its details.
 * This interface is implemented by account-level transactions and debit-card specific transactions.
 */
export interface ITransaction {
    /**
     * Retrieves the date when the transaction occurred.
     * @returns Promise resolving to the transaction date as a Luxon DateTime object
     */
    getDate(): Promise<DateTime>

    /**
     * Gets the unique reference ID of the transaction.
     * @returns Promise resolving to the transaction reference ID string
     */
    getReferenceID(): Promise<string>

    /**
     * Retrieves the description or details of the transaction.
     * @returns Promise resolving to the transaction description
     */
    getDescription(): Promise<string>

    /**
     * Gets the debit amount of the transaction (money withdrawn).
     * @returns Promise resolving to the debit amount, or null if not applicable
     */
    getDebit(): Promise<number | null>

    /**
     * Gets the credit amount of the transaction (money deposited).
     * @returns Promise resolving to the credit amount, or null if not applicable
     */
    getCredit(): Promise<number | null>

    toDebugString(): Promise<string>
}

export async function saveTransaction(tenantID: string, accountID: string, tx: ITransaction, sequence: number) {
    const debit: number | null  = await tx.getDebit()
    const credit: number | null = await tx.getCredit()
    const amount: number        = debit || credit || 0
    const debugInfo: string     = await tx.toDebugString()

    console.info(`Saving transaction: ${debugInfo}`)
    if (!amount) {
        throw new Error(`Cannot save transaction with no amount (debit=${debit}) (credit=${credit}) (${debugInfo}`)
    }

    const result = await client.mutation(CreateTransaction, {
        tx: {
            tenantID,
            date: await tx.getDate(),
            sequence,
            referenceID: await tx.getReferenceID(),
            amount,
            currency: "ILS",
            description: await tx.getDescription(),
            sourceAccountID: (debit || 0) > 0 ? accountID : null,
            targetAccountID: (credit || 0) > 0 ? accountID : null,
        },
    })
    if (result.error) {
        throw new Error(
            `Failed to create Transaction: ${result.error.message}\n` +
            `- Network Error: ${JSON.stringify(result.error.networkError, null, 2)}\n` +
            `- GraphQL Errors: ${JSON.stringify(result.error.graphQLErrors, null, 2)}\n` +
            `- Debug info: ${debugInfo}`,
        )
    }
}

export async function getDateFromLocator(locator: Locator): Promise<DateTime> {
    if (await locator.count() == 0) {
        return DateTime.invalid("Transaction row has no date")
    }

    const dateStr              = await locator.innerText()
    const [ day, month, year ] = dateStr.split("/")
    // const i                    = this.index - 1
    return DateTime.fromObject({
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: 12,
    }, { zone: "Asia/Jerusalem" })
}

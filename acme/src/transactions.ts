import { gql } from "@urql/core"
import { graphQLClient } from "./graphql-client.js"
import { ACMEAccount } from "./main.js"
import { randomNumber, randomUUID } from "./util.js"
import { DateTime, Duration } from "luxon"
import { CreateTransactionMutation, CreateTransactionMutationVariables, Tenant } from "./graphql/graphql.js"

const now = DateTime.now()

export const CreateTransaction = gql(`
    mutation CreateTransaction(
        $tenantID: ID!
        $date: DateTime!
        $sequence: Int!
        $referenceID: String!
        $description: String!
        $amount: Float!
        $currency: String!
        $sourceAccountID: ID
        $targetAccountID: ID
    ) {
        createTransaction(tx: {
            tenantID: $tenantID
            date: $date
            sequence: $sequence
            referenceID: $referenceID
            description: $description
            amount: $amount
            currency: $currency
            sourceAccountID: $sourceAccountID
            targetAccountID: $targetAccountID
        }) {
            id
        }
    }
`)

export async function generateAccountTransactions(tenantID: Tenant["id"], defaultCurrency: string, account: ACMEAccount) {
    if (account.outgoingTransactions?.length) {
        for (let tx of account.outgoingTransactions) {
            let date           = parseDate(tx.date)
            let amount: number = tx.amount || randomNumber() * 30000

            for (let i = 0; i < (tx.repeat || 1); i++) {
                const referenceID     = randomUUID()
                const description     = tx.description || `${account.id} -> ${tx.targetAccountID}`
                const currency        = tx.currency || defaultCurrency
                const sourceAccountID = account.id
                const targetAccountID = tx.targetAccountID
                const result          = await graphQLClient.mutation<CreateTransactionMutation, CreateTransactionMutationVariables>(
                    CreateTransaction,
                    { tenantID, date, sequence: 0, referenceID, description, amount, currency, sourceAccountID, targetAccountID }).toPromise()
                if (result.error) {
                    throw result.error
                }

                date   = bumpDate(date, tx.dateDelta)
                amount = bumpAmount(amount, tx.amountDelta)
            }
        }
    }

    if (account.children?.length) {
        for (let child of account.children) {
            await generateAccountTransactions(tenantID, defaultCurrency, child)
        }
    }
}

function parseDate(input?: string): DateTime<true> {
    if (!input) {
        return now
    } else if (input === "+") {
        return now.plus(Duration.fromISO(input.substring(1)))
    } else if (input[0] === "-") {
        return now.minus(Duration.fromISO(input.substring(1)))
    } else {
        let parsed = DateTime.fromISO(input, {zone: "UTC"})
        if (parsed.isValid) {
            return parsed
        } else {
            throw new Error(`Invalid date: ${input}`)
        }
    }
}

function bumpDate(date: DateTime<true>, delta?: string) {
    if (delta) {
        if (delta[0] === "+") {
            return date.plus(Duration.fromISO(delta.substring(1)))
        } else if (delta[0] === "-") {
            return date.minus(Duration.fromISO(delta.substring(1)))
        } else {
            throw new Error(`Invalid date delta: ${delta}`)
        }
    } else {
        return date
    }
}

function bumpAmount(amount: number, delta?: string | number) {
    if (typeof delta === "string") {
        if (delta.startsWith("+")) {
            return amount + parseFloat(delta.substring(1))
        } else if (delta.startsWith("-")) {
            return amount - parseFloat(delta.substring(1))
        } else if (delta.startsWith("±") || delta.startsWith("~")) {
            const limit = parseFloat(delta.substring(1))
            return amount - limit / 2 + randomNumber() * limit
        } else {
            return amount + parseFloat(delta)
        }
    } else if (typeof delta === "number") {
        return amount + (delta as number)
    } else {
        return amount
    }
}

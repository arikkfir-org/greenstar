import { gql } from "../graphql"
import { DateTime } from "luxon"
import { client } from "./client.ts"
import { generalConfig } from "./general-config.ts"

const GetLastSuccessfulScrapedDate = gql(`
    query GetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!) {
        tenant(id: $tenantID) {
            scraper(id: $scraperID) {
                lastSuccessfulScrapedDate
            }
        }
    }
`)

const SetLastSuccessfulScrapedDate = gql(`
    mutation SetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!, $date: DateTime!) {
        setLastSuccessfulScrapedDate(tenantID: $tenantID, scraperID: $scraperID, date: $date)
    }
`)

export async function getLastSuccessfulScrapedDate(): Promise<DateTime | null> {
    const result = await client.query(GetLastSuccessfulScrapedDate, {
        tenantID: generalConfig.tenantID,
        scraperID: generalConfig.scraperID,
    })

    if (result.error) {
        throw new Error(
            `Failed to fetch scraper last successful scraped date: ${result.error.message}\n` +
            `- Network Error: ${JSON.stringify(result.error.networkError, null, 2)}\n` +
            `- GraphQL Errors: ${JSON.stringify(result.error.graphQLErrors, null, 2)}`,
        )
    }

    return result?.data?.tenant?.scraper?.lastSuccessfulScrapedDate || null
}

export async function setLastSuccessfulScrapedDate(date: DateTime): Promise<void> {
    const result = await client.mutation(SetLastSuccessfulScrapedDate, {
        tenantID: generalConfig.tenantID,
        scraperID: generalConfig.scraperID,
        date,
    })

    if (result.error) {
        throw new Error(
            `Failed to set scraper last successful scraped date: ${result.error.message}\n` +
            `- Network Error: ${JSON.stringify(result.error.networkError, null, 2)}\n` +
            `- GraphQL Errors: ${JSON.stringify(result.error.graphQLErrors, null, 2)}`,
        )
    }
}

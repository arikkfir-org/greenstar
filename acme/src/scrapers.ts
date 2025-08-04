import { gql } from "@urql/core"
import { graphQLClient } from "./graphql-client.js"
import { Tenant, UpsertScraperMutation, UpsertScraperMutationVariables } from "./graphql/graphql.js"
import { ACMEScraper } from "./main.js"
import { splitCamelCase } from "./util.js"

export const UpsertScraper = gql(`
    mutation UpsertScraper(
        $tenantID: ID!
        $id: ID!,
        $scraperTypeID: ID!
        $displayName: String!
        $parameters: [ScraperParameterInput!]!
    ) {
        upsertScraper(
            tenantID: $tenantID
            id: $id
            scraperTypeID: $scraperTypeID
            displayName: $displayName
            parameters: $parameters
        ) {
            id
        }
    }
`)

export async function generateScraper(tenantID: Tenant["id"], scraper: ACMEScraper) {
    const result = await graphQLClient.mutation<UpsertScraperMutation, UpsertScraperMutationVariables>(
        UpsertScraper,
        {
            tenantID,
            id: scraper.id,
            scraperTypeID: scraper.type,
            displayName: scraper.displayName || splitCamelCase(scraper.id),
            parameters: Object.entries(scraper.parameters || {})
                              .map(([ parameterID, value ]) => ({ parameterID, value })) || [],
        }).toPromise()
    if (result.error) {
        throw result.error
    }
}

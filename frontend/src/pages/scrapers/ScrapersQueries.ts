import { gql } from "../../graphql"
import {
    AccountsForScraperAccountParameterQuery, ScraperJobQuery,
    ScraperJobsQuery,
    ScrapersQuery,
    ScraperTypesQuery,
} from "../../graphql/graphql.ts"

export const ScraperTypes = gql(`
    query ScraperTypes {
        scraperTypes {
            id
            displayName
            parameters {
                id
                displayName
                type
            }
        }
    }
`)
export type ScraperTypeRow = NonNullable<ScraperTypesQuery["scraperTypes"]>[number]

export const AccountsForScraperAccountParameter = gql(`
    query AccountsForScraperAccountParameter($tenantID: ID!, $filter: String) {
        tenant(id: $tenantID) {
            id
            accounts(filter: $filter) {
                id
                displayName
            }
        }
    }
`)
export type AccountForScraperAccountParameterRow = NonNullable<AccountsForScraperAccountParameterQuery["tenant"]>["accounts"][number]

export const Scraper       = gql(`
    query Scraper($tenantID: ID!, $scraperID: ID!) {
        tenant(id: $tenantID) {
            id
            scraper(id: $scraperID) {
                id
                createdAt
                updatedAt
                displayName
                lastSuccessfulScrapedDate
                type {
                    id
                    displayName
                    createdAt
                    updatedAt
                    parameters {
                        id
                        displayName
                        type
                    }
                }
                parameters {
                    parameter {
                        id
                        displayName
                        type
                    }
                    value
                }
            }
        }
    }
`)
export const Scrapers      = gql(`
    query Scrapers($tenantID: ID!) {
        tenant(id: $tenantID) {
            id
            scrapers {
                id
                createdAt
                updatedAt
                displayName
                lastSuccessfulScrapedDate
                type {
                    id
                    displayName
                    createdAt
                    updatedAt
                    parameters {
                        id
                        displayName
                        type
                    }
                }
                parameters {
                    parameter {
                        id
                        displayName
                        type
                    }
                    value
                }
            }
        }
    }
`)
export const UpsertScraper = gql(`
    mutation UpsertScraper(
        $tenantID: ID!,
        $scraperID: ID,
        $scraperTypeID: ID!,
        $displayName: String!,
        $parameters: [ScraperParameterInput!]!
    ) {
        upsertScraper(
            tenantID: $tenantID,
            id: $scraperID,
            scraperTypeID: $scraperTypeID,
            displayName: $displayName,
            parameters: $parameters
        ) {
            id
            createdAt
            updatedAt
            displayName
            lastSuccessfulScrapedDate
            type {
                id
                displayName
                createdAt
                updatedAt
                parameters {
                    id
                    displayName
                    type
                }
            }
            parameters {
                parameter {
                    id
                    displayName
                    type
                }
                value
            }
        }
    }
`)
export type ScraperRow = NonNullable<ScrapersQuery["tenant"]> [ "scrapers" ][number]

export const DeleteScraper = gql(`
    mutation DeleteScraper($tenantID: ID!, $id: ID!) {
        deleteScraper(tenantID: $tenantID, id: $id)
    }
`)

export const TriggerScraper = gql(`
    mutation TriggerScraper($tenantID: ID!, $scraperID: ID!) {
        triggerScraper(tenantID: $tenantID, id: $scraperID) {
            id
            createdAt
            status
            parameters {
                parameter {
                    id
                    displayName
                    type
                }
                value
            }
        }
    }
`)

export const ScraperJob = gql(`
    query ScraperJob($tenantID: ID!, $scraperID: ID!, $scraperJobID: ID!) {
        tenant(id: $tenantID) {
            id
            scraper(id: $scraperID) {
                id
                job(id: $scraperJobID) {
                    id
                    createdAt
                    scraper {
                        id
                    }
                    status
                    parameters {
                        parameter {
                            id
                            displayName
                            type
                        }
                        value
                    }
                }
            }
        }
    }
`)
export type SingleScraperJobRow = NonNullable<NonNullable<NonNullable<ScraperJobQuery["tenant"]> [ "scraper" ]>["job"]>

export const ScraperJobs = gql(`
    query ScraperJobs($tenantID: ID!, $scraperID: ID!) {
        tenant(id: $tenantID) {
            id
            scraper(id: $scraperID) {
                id
                jobs {
                    id
                    createdAt
                    status
                    parameters {
                        parameter {
                            id
                            displayName
                            type
                        }
                        value
                    }
                }
            }
        }
    }
`)
export type ScraperJobRow = NonNullable<NonNullable<ScraperJobsQuery["tenant"]> [ "scraper" ]>["jobs"][number]

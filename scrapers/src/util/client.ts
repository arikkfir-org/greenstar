import { cacheExchange, Client, fetchExchange } from "@urql/core"

const apiURL = process.env.GRAPHQL_API_URL
if (!apiURL) {
    throw new Error("missing GRAPHQL_API_URL environment variable")
}

export const client = new Client({
    url: apiURL,
    exchanges: [ cacheExchange, fetchExchange ],
})

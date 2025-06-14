import { ApolloClient, from, HttpLink, InMemoryCache, InMemoryCacheConfig, NormalizedCacheObject } from "@apollo/client"
import { luxonDateTimeMiddleware } from "./LuxonApolloLinkMiddleware.ts"
import { onError } from "@apollo/client/link/error"
import { enqueueSnackbar } from "notistack"
import { dismissAction } from "./notistack-actions.tsx"
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (import.meta.env.DEV) {
    loadDevMessages();
    loadErrorMessages();
}

export const apiURL = `${import.meta.env.VITE_API_URL}`
if (!apiURL) {
    throw new Error("missing VITE_API_URL environment variable")
}

const apiURLObj         = new URL(apiURL)
export const apiScheme  = apiURLObj.protocol.replace(":", "")
export const apiHost    = apiURLObj.host
export const apiPort    = apiURLObj.port || (apiScheme == "https:" ? "443" : "80")
export const graphQLURL = `${apiURL}/graphql`

const apolloCacheConfig: InMemoryCacheConfig = {
    typePolicies: {
        Tenant: {
            fields: {
                transactions: {
                    keyArgs: [ "tenantID", "involvingAccountID", "sort" ],
                    merge(existing, incoming) {
                        const existingRows = existing?.rows || []
                        const incomingRows = incoming?.rows || []
                        const offset       = incoming?.offset || existingRows.length
                        return existingRows.slice(0, offset).concat(incomingRows).concat(incomingRows)
                    },
                },
            },
        },
    },
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors?.length) {
        graphQLErrors.forEach(({ message }) =>
            enqueueSnackbar(message || "An error occurred", {
                variant: "error",
                action: dismissAction,
                autoHideDuration: 10_000,
            }),
        )
    }
    if (networkError) {
        enqueueSnackbar(networkError.message, {
            variant: "error",
            action: dismissAction,
            autoHideDuration: 10_000,
        })
    }
})

const handlerLink = luxonDateTimeMiddleware.concat(new HttpLink({ uri: graphQLURL }))

export const apolloClient = new ApolloClient<NormalizedCacheObject>({
    link: from([ errorLink, handlerLink ]),
    cache: new InMemoryCache(apolloCacheConfig),
})

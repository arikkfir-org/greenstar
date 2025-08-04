import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
    schema: "../server/src/schema/*.graphql",
    documents: ["src/**/*.{ts,tsx}"],
    ignoreNoDocuments: true,
    generates: {
        "./src/graphql/": {
            preset: "client",
            plugins: [
                {
                    add: {
                        content: 'import { DateTime } from "luxon";',
                    },
                },
            ],
            // config: {
            //     documentMode: 'string',
            // },
            config: {
                scalars: {
                    DateTime: "DateTime",
                },
            },
            presetConfig: {
                gqlTagName: "gql",
                scalars: {
                    DateTime: "DateTime",
                },
            },
        },
    },
}

export default config

/* eslint-disable */
import * as types from './graphql.js';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    mutation CreateAccount(\n        $tenantID: ID!\n        $id: ID!\n        $parentID: ID\n        $displayName: String!\n        $icon: String\n        $type: AccountType\n    ) {\n        createAccount(\n            tenantID: $tenantID\n            id: $id\n            parentID: $parentID\n            icon: $icon\n            type: $type\n            displayName: $displayName\n        ) {\n            id\n            displayName\n        }\n    }\n": typeof types.CreateAccountDocument,
    "\n    mutation CreateScraper(\n        $tenantID: ID!\n        $scraperTypeID: ID!\n        $id: ID!\n        $displayName: String!\n        $parameters: [ScraperParameterInput!]!\n    ) {\n        createScraper(\n            tenantID: $tenantID\n            scraperTypeID: $scraperTypeID\n            id: $id\n            displayName: $displayName\n            parameters: $parameters\n        ) {\n            id\n        }\n    }\n": typeof types.CreateScraperDocument,
    "\n    query FindTenant($id: ID!) {\n        tenant(id: $id) {\n            id\n        }\n    }\n": typeof types.FindTenantDocument,
    "\n    mutation DeleteTenant($id: ID!) {\n        deleteTenant(id: $id)\n    }\n": typeof types.DeleteTenantDocument,
    "\n    mutation CreateTenant($id: ID!, $displayName: String!) {\n        createTenant(id: $id, displayName: $displayName) {\n            id\n            displayName\n        }\n    }\n": typeof types.CreateTenantDocument,
    "\n    query FindTenantAccounts($id: ID!) {\n        tenant(id: $id) {\n            accounts {\n                id\n            }\n        }\n    }\n": typeof types.FindTenantAccountsDocument,
    "\n    mutation CreateTransaction(\n        $tenantID: ID!\n        $date: DateTime!\n        $sequence: Int!\n        $referenceID: String!\n        $description: String!\n        $amount: Float!\n        $currency: String!\n        $sourceAccountID: ID\n        $targetAccountID: ID\n    ) {\n        createTransaction(tx: {\n            tenantID: $tenantID\n            date: $date\n            sequence: $sequence\n            referenceID: $referenceID\n            description: $description\n            amount: $amount\n            currency: $currency\n            sourceAccountID: $sourceAccountID\n            targetAccountID: $targetAccountID\n        }) {\n            id\n        }\n    }\n": typeof types.CreateTransactionDocument,
};
const documents: Documents = {
    "\n    mutation CreateAccount(\n        $tenantID: ID!\n        $id: ID!\n        $parentID: ID\n        $displayName: String!\n        $icon: String\n        $type: AccountType\n    ) {\n        createAccount(\n            tenantID: $tenantID\n            id: $id\n            parentID: $parentID\n            icon: $icon\n            type: $type\n            displayName: $displayName\n        ) {\n            id\n            displayName\n        }\n    }\n": types.CreateAccountDocument,
    "\n    mutation CreateScraper(\n        $tenantID: ID!\n        $scraperTypeID: ID!\n        $id: ID!\n        $displayName: String!\n        $parameters: [ScraperParameterInput!]!\n    ) {\n        createScraper(\n            tenantID: $tenantID\n            scraperTypeID: $scraperTypeID\n            id: $id\n            displayName: $displayName\n            parameters: $parameters\n        ) {\n            id\n        }\n    }\n": types.CreateScraperDocument,
    "\n    query FindTenant($id: ID!) {\n        tenant(id: $id) {\n            id\n        }\n    }\n": types.FindTenantDocument,
    "\n    mutation DeleteTenant($id: ID!) {\n        deleteTenant(id: $id)\n    }\n": types.DeleteTenantDocument,
    "\n    mutation CreateTenant($id: ID!, $displayName: String!) {\n        createTenant(id: $id, displayName: $displayName) {\n            id\n            displayName\n        }\n    }\n": types.CreateTenantDocument,
    "\n    query FindTenantAccounts($id: ID!) {\n        tenant(id: $id) {\n            accounts {\n                id\n            }\n        }\n    }\n": types.FindTenantAccountsDocument,
    "\n    mutation CreateTransaction(\n        $tenantID: ID!\n        $date: DateTime!\n        $sequence: Int!\n        $referenceID: String!\n        $description: String!\n        $amount: Float!\n        $currency: String!\n        $sourceAccountID: ID\n        $targetAccountID: ID\n    ) {\n        createTransaction(tx: {\n            tenantID: $tenantID\n            date: $date\n            sequence: $sequence\n            referenceID: $referenceID\n            description: $description\n            amount: $amount\n            currency: $currency\n            sourceAccountID: $sourceAccountID\n            targetAccountID: $targetAccountID\n        }) {\n            id\n        }\n    }\n": types.CreateTransactionDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateAccount(\n        $tenantID: ID!\n        $id: ID!\n        $parentID: ID\n        $displayName: String!\n        $icon: String\n        $type: AccountType\n    ) {\n        createAccount(\n            tenantID: $tenantID\n            id: $id\n            parentID: $parentID\n            icon: $icon\n            type: $type\n            displayName: $displayName\n        ) {\n            id\n            displayName\n        }\n    }\n"): (typeof documents)["\n    mutation CreateAccount(\n        $tenantID: ID!\n        $id: ID!\n        $parentID: ID\n        $displayName: String!\n        $icon: String\n        $type: AccountType\n    ) {\n        createAccount(\n            tenantID: $tenantID\n            id: $id\n            parentID: $parentID\n            icon: $icon\n            type: $type\n            displayName: $displayName\n        ) {\n            id\n            displayName\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateScraper(\n        $tenantID: ID!\n        $scraperTypeID: ID!\n        $id: ID!\n        $displayName: String!\n        $parameters: [ScraperParameterInput!]!\n    ) {\n        createScraper(\n            tenantID: $tenantID\n            scraperTypeID: $scraperTypeID\n            id: $id\n            displayName: $displayName\n            parameters: $parameters\n        ) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation CreateScraper(\n        $tenantID: ID!\n        $scraperTypeID: ID!\n        $id: ID!\n        $displayName: String!\n        $parameters: [ScraperParameterInput!]!\n    ) {\n        createScraper(\n            tenantID: $tenantID\n            scraperTypeID: $scraperTypeID\n            id: $id\n            displayName: $displayName\n            parameters: $parameters\n        ) {\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query FindTenant($id: ID!) {\n        tenant(id: $id) {\n            id\n        }\n    }\n"): (typeof documents)["\n    query FindTenant($id: ID!) {\n        tenant(id: $id) {\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation DeleteTenant($id: ID!) {\n        deleteTenant(id: $id)\n    }\n"): (typeof documents)["\n    mutation DeleteTenant($id: ID!) {\n        deleteTenant(id: $id)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateTenant($id: ID!, $displayName: String!) {\n        createTenant(id: $id, displayName: $displayName) {\n            id\n            displayName\n        }\n    }\n"): (typeof documents)["\n    mutation CreateTenant($id: ID!, $displayName: String!) {\n        createTenant(id: $id, displayName: $displayName) {\n            id\n            displayName\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query FindTenantAccounts($id: ID!) {\n        tenant(id: $id) {\n            accounts {\n                id\n            }\n        }\n    }\n"): (typeof documents)["\n    query FindTenantAccounts($id: ID!) {\n        tenant(id: $id) {\n            accounts {\n                id\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateTransaction(\n        $tenantID: ID!\n        $date: DateTime!\n        $sequence: Int!\n        $referenceID: String!\n        $description: String!\n        $amount: Float!\n        $currency: String!\n        $sourceAccountID: ID\n        $targetAccountID: ID\n    ) {\n        createTransaction(tx: {\n            tenantID: $tenantID\n            date: $date\n            sequence: $sequence\n            referenceID: $referenceID\n            description: $description\n            amount: $amount\n            currency: $currency\n            sourceAccountID: $sourceAccountID\n            targetAccountID: $targetAccountID\n        }) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation CreateTransaction(\n        $tenantID: ID!\n        $date: DateTime!\n        $sequence: Int!\n        $referenceID: String!\n        $description: String!\n        $amount: Float!\n        $currency: String!\n        $sourceAccountID: ID\n        $targetAccountID: ID\n    ) {\n        createTransaction(tx: {\n            tenantID: $tenantID\n            date: $date\n            sequence: $sequence\n            referenceID: $referenceID\n            description: $description\n            amount: $amount\n            currency: $currency\n            sourceAccountID: $sourceAccountID\n            targetAccountID: $targetAccountID\n        }) {\n            id\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
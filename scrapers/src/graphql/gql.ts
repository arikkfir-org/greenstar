/* eslint-disable */
import * as types from './graphql';
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
    "\n    query GetTransactionsCount($tenantID: ID!) {\n        tenant(id: $tenantID) {\n            totalTransactions\n        }\n    }\n": typeof types.GetTransactionsCountDocument,
    "\n    mutation CreateTransaction($tx: CreateTransaction!) {\n        createTransaction(tx: $tx) {\n            id\n        }\n    }\n": typeof types.CreateTransactionDocument,
    "\n    query GetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!) {\n        tenant(id: $tenantID) {\n            scraper(id: $scraperID) {\n                lastSuccessfulScrapedDate\n            }\n        }\n    }\n": typeof types.GetLastSuccessfulScrapedDateDocument,
    "\n    mutation SetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!, $date: DateTime!) {\n        setLastSuccessfulScrapedDate(tenantID: $tenantID, scraperID: $scraperID, date: $date)\n    }\n": typeof types.SetLastSuccessfulScrapedDateDocument,
};
const documents: Documents = {
    "\n    query GetTransactionsCount($tenantID: ID!) {\n        tenant(id: $tenantID) {\n            totalTransactions\n        }\n    }\n": types.GetTransactionsCountDocument,
    "\n    mutation CreateTransaction($tx: CreateTransaction!) {\n        createTransaction(tx: $tx) {\n            id\n        }\n    }\n": types.CreateTransactionDocument,
    "\n    query GetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!) {\n        tenant(id: $tenantID) {\n            scraper(id: $scraperID) {\n                lastSuccessfulScrapedDate\n            }\n        }\n    }\n": types.GetLastSuccessfulScrapedDateDocument,
    "\n    mutation SetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!, $date: DateTime!) {\n        setLastSuccessfulScrapedDate(tenantID: $tenantID, scraperID: $scraperID, date: $date)\n    }\n": types.SetLastSuccessfulScrapedDateDocument,
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
export function gql(source: "\n    query GetTransactionsCount($tenantID: ID!) {\n        tenant(id: $tenantID) {\n            totalTransactions\n        }\n    }\n"): (typeof documents)["\n    query GetTransactionsCount($tenantID: ID!) {\n        tenant(id: $tenantID) {\n            totalTransactions\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateTransaction($tx: CreateTransaction!) {\n        createTransaction(tx: $tx) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation CreateTransaction($tx: CreateTransaction!) {\n        createTransaction(tx: $tx) {\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!) {\n        tenant(id: $tenantID) {\n            scraper(id: $scraperID) {\n                lastSuccessfulScrapedDate\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!) {\n        tenant(id: $tenantID) {\n            scraper(id: $scraperID) {\n                lastSuccessfulScrapedDate\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation SetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!, $date: DateTime!) {\n        setLastSuccessfulScrapedDate(tenantID: $tenantID, scraperID: $scraperID, date: $date)\n    }\n"): (typeof documents)["\n    mutation SetLastSuccessfulScrapedDate($tenantID: ID!, $scraperID: ID!, $date: DateTime!) {\n        setLastSuccessfulScrapedDate(tenantID: $tenantID, scraperID: $scraperID, date: $date)\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
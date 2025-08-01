/* eslint-disable */
import { DateTime } from "luxon";
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: DateTime; output: DateTime; }
  Void: { input: void | null; output: void | null; }
};

export type Account = {
  __typename?: 'Account';
  balance: Scalars['Float']['output'];
  balanceOverTime: Array<BalancePoint>;
  childCount: Scalars['Int']['output'];
  children: Array<Account>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  incomingTransactions: TransactionsResult;
  outgoingTransactions: TransactionsResult;
  parent?: Maybe<Account>;
  tenant: Tenant;
  transactions: TransactionsResult;
  type?: Maybe<AccountType>;
  updatedAt: Scalars['DateTime']['output'];
};


export type AccountBalanceArgs = {
  currency: Scalars['String']['input'];
  until?: InputMaybe<Scalars['DateTime']['input']>;
};


export type AccountBalanceOverTimeArgs = {
  currency: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type AccountIncomingTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  since?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<Array<TransactionsSortColumnsInput>>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
};


export type AccountOutgoingTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  since?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<Array<TransactionsSortColumnsInput>>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
};


export type AccountTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  since?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<Array<TransactionsSortColumnsInput>>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AccountBalanceOverTime = {
  __typename?: 'AccountBalanceOverTime';
  account: Account;
  points: Array<BalancePoint>;
};

export enum AccountType {
  CheckingAccount = 'CheckingAccount'
}

export type BalancePoint = {
  __typename?: 'BalancePoint';
  balance: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
};

export type CreateTransaction = {
  amount: Scalars['Float']['input'];
  currency: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  referenceID: Scalars['String']['input'];
  sequence: Scalars['Int']['input'];
  sourceAccountID?: InputMaybe<Scalars['ID']['input']>;
  targetAccountID?: InputMaybe<Scalars['ID']['input']>;
  tenantID: Scalars['ID']['input'];
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['String']['output'];
  countries: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  decimalDigits: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  namePlural: Scalars['String']['output'];
  nativeSymbol: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CurrencyRate = {
  __typename?: 'CurrencyRate';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  rate: Scalars['Float']['output'];
  sourceCurrency: Currency;
  targetCurrency: Currency;
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  createCurrencyRate: CurrencyRate;
  createScraper: Scraper;
  createTenant: Tenant;
  createTransaction: Transaction;
  deleteAccount: Scalars['Void']['output'];
  deleteScraper: Scalars['Void']['output'];
  deleteTenant?: Maybe<Scalars['Void']['output']>;
  deleteTransaction: Scalars['Void']['output'];
  moveAccount: Account;
  noOp: Scalars['Void']['output'];
};


export type MutationCreateAccountArgs = {
  displayName: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  parentID?: InputMaybe<Scalars['ID']['input']>;
  tenantID: Scalars['ID']['input'];
  type?: InputMaybe<AccountType>;
};


export type MutationCreateCurrencyRateArgs = {
  date: Scalars['DateTime']['input'];
  rate: Scalars['Float']['input'];
  sourceCurrencyCode: Scalars['String']['input'];
  targetCurrencyCode: Scalars['String']['input'];
};


export type MutationCreateScraperArgs = {
  displayName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  parameters: Array<ScraperParameterInput>;
  scraperTypeID: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};


export type MutationCreateTenantArgs = {
  displayName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationCreateTransactionArgs = {
  tx: CreateTransaction;
};


export type MutationDeleteAccountArgs = {
  id: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};


export type MutationDeleteScraperArgs = {
  id: Scalars['ID']['input'];
  scraperTypeID: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};


export type MutationDeleteTenantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};


export type MutationMoveAccountArgs = {
  accountID: Scalars['ID']['input'];
  targetParentAccountID?: InputMaybe<Scalars['ID']['input']>;
  tenantID: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  currencies: Array<Currency>;
  currency?: Maybe<Currency>;
  currencyRate?: Maybe<CurrencyRate>;
  currencyRates: Array<CurrencyRate>;
  scraperParameterTypes: Array<ScraperParameterType>;
  scraperTypes: Array<ScraperType>;
  tenant?: Maybe<Tenant>;
  tenants: Array<Tenant>;
  version: Scalars['String']['output'];
};


export type QueryCurrencyArgs = {
  code: Scalars['String']['input'];
};


export type QueryCurrencyRateArgs = {
  date: Scalars['DateTime']['input'];
  sourceCurrencyCode: Scalars['String']['input'];
  targetCurrencyCode: Scalars['String']['input'];
};


export type QueryCurrencyRatesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sourceCurrencyCode?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  targetCurrencyCode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTenantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTenantsArgs = {
  sort?: InputMaybe<Array<TenantsSortColumnsInput>>;
};

export type Scraper = {
  __typename?: 'Scraper';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  parameters: Array<ScraperParameter>;
  type: ScraperType;
  updatedAt: Scalars['DateTime']['output'];
};

export type ScraperParameter = {
  __typename?: 'ScraperParameter';
  createdAt: Scalars['DateTime']['output'];
  parameter: ScraperTypeParameter;
  scraper: Scraper;
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type ScraperParameterInput = {
  scraperTypeParameterID: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type ScraperParameterType = {
  __typename?: 'ScraperParameterType';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ScraperType = {
  __typename?: 'ScraperType';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  parameters: Array<ScraperTypeParameter>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ScraperTypeParameter = {
  __typename?: 'ScraperTypeParameter';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  parameterType: ScraperParameterType;
  scraperType: ScraperType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum SortDirection {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type Tenant = {
  __typename?: 'Tenant';
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountsBalanceOverTime: Array<AccountBalanceOverTime>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  firstTransactionDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastTransactionDate?: Maybe<Scalars['DateTime']['output']>;
  rootAccounts: Array<Account>;
  scrapers: Array<Scraper>;
  totalTransactions: Scalars['Int']['output'];
  transaction?: Maybe<Transaction>;
  transactions: TransactionsResult;
  updatedAt: Scalars['DateTime']['output'];
};


export type TenantAccountArgs = {
  id: Scalars['ID']['input'];
};


export type TenantAccountsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


export type TenantAccountsBalanceOverTimeArgs = {
  accountIDs: Array<Scalars['ID']['input']>;
  currency: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type TenantTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type TenantTransactionsArgs = {
  involvingAccountID?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  since?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<Array<TransactionsSortColumnsInput>>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum TenantsSortColumns {
  DisplayName = 'DisplayName',
  Id = 'ID'
}

export type TenantsSortColumnsInput = {
  col: TenantsSortColumns;
  direction: SortDirection;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Currency;
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  referenceID: Scalars['String']['output'];
  sequence: Scalars['Int']['output'];
  sourceAccount: Account;
  targetAccount: Account;
  updatedAt: Scalars['DateTime']['output'];
};

export type TransactionsResult = {
  __typename?: 'TransactionsResult';
  rows: Array<Transaction>;
  totalCount: Scalars['Int']['output'];
};

export enum TransactionsSortColumns {
  Amount = 'Amount',
  CreatedAt = 'CreatedAt',
  Date = 'Date',
  Description = 'Description',
  Id = 'ID',
  ReferenceId = 'ReferenceID',
  SourceAccountName = 'SourceAccountName',
  TargetAccountName = 'TargetAccountName',
  UpdatedAt = 'UpdatedAt'
}

export type TransactionsSortColumnsInput = {
  col: TransactionsSortColumns;
  direction: SortDirection;
};

export type RootAccountsQueryQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
  until?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type RootAccountsQueryQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string, rootAccounts: Array<{ __typename?: 'Account', id: string, icon: string, childCount: number, balance: number, label: string }> } | null };

export type ChildAccountsQueryQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  parentID: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
  until?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type ChildAccountsQueryQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string, account?: { __typename?: 'Account', id: string, children: Array<{ __typename?: 'Account', id: string, icon: string, childCount: number, balance: number, label: string }> } | null } | null };

export type MoveAccountMutationVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  accountID: Scalars['ID']['input'];
  targetParentAccountID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type MoveAccountMutation = { __typename?: 'Mutation', moveAccount: { __typename?: 'Account', id: string } };

export type AccountBalanceOverTimeQueryQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  accountIDs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  currency: Scalars['String']['input'];
}>;


export type AccountBalanceOverTimeQueryQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string, accountsBalanceOverTime: Array<{ __typename?: 'AccountBalanceOverTime', account: { __typename?: 'Account', id: string, label: string }, points: Array<{ __typename?: 'BalancePoint', date: DateTime, balance: number }> }> } | null };

export type AllAccountsQueryQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
}>;


export type AllAccountsQueryQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string, accounts: Array<{ __typename?: 'Account', id: string, displayName: string, icon: string, balance: number }> } | null };

export type SubAccountsQueryQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  accountID: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
  until?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type SubAccountsQueryQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string, account?: { __typename?: 'Account', id: string, children: Array<{ __typename?: 'Account', id: string, displayName: string, icon: string, balance: number }> } | null } | null };

export type TransactionsQueryQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  involvingAccountID?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<TransactionsSortColumnsInput> | TransactionsSortColumnsInput>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type TransactionsQueryQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string, transactions: { __typename?: 'TransactionsResult', totalCount: number, rows: Array<{ __typename?: 'Transaction', id: string, createdAt: DateTime, updatedAt: DateTime, amount: number, date: DateTime, description: string, referenceID: string, currency: { __typename?: 'Currency', code: string }, sourceAccount: { __typename?: 'Account', id: string, icon: string, displayName: string }, targetAccount: { __typename?: 'Account', id: string, icon: string, displayName: string } }> } } | null };

export type CurrenciesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrenciesQueryQuery = { __typename?: 'Query', currencies: Array<{ __typename?: 'Currency', code: string, createdAt: DateTime, updatedAt: DateTime, symbol: string, nativeSymbol: string, name: string, namePlural: string, decimalDigits: number, countries: Array<string> }> };


export const RootAccountsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootAccountsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rootAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"label"},"name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"childCount"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}]}]}}]}}]}}]} as unknown as DocumentNode<RootAccountsQueryQuery, RootAccountsQueryQueryVariables>;
export const ChildAccountsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChildAccountsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"label"},"name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"childCount"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<ChildAccountsQueryQuery, ChildAccountsQueryQueryVariables>;
export const MoveAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetParentAccountID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountID"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetParentAccountID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetParentAccountID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MoveAccountMutation, MoveAccountMutationVariables>;
export const AccountBalanceOverTimeQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountBalanceOverTimeQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountIDs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountsBalanceOverTime"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountIDs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountIDs"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"label"},"name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AccountBalanceOverTimeQueryQuery, AccountBalanceOverTimeQueryQueryVariables>;
export const AllAccountsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllAccountsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}]}]}}]}}]}}]} as unknown as DocumentNode<AllAccountsQueryQuery, AllAccountsQueryQueryVariables>;
export const SubAccountsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubAccountsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"balance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<SubAccountsQueryQuery, SubAccountsQueryQueryVariables>;
export const TransactionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"involvingAccountID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsSortColumnsInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"involvingAccountID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"involvingAccountID"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"referenceID"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"targetAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<TransactionsQueryQuery, TransactionsQueryQueryVariables>;
export const CurrenciesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrenciesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"nativeSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"namePlural"}},{"kind":"Field","name":{"kind":"Name","value":"decimalDigits"}},{"kind":"Field","name":{"kind":"Name","value":"countries"}}]}}]}}]} as unknown as DocumentNode<CurrenciesQueryQuery, CurrenciesQueryQueryVariables>;
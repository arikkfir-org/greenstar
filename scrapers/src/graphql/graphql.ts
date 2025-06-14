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
  Void: { input: any; output: any; }
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
  createTenant: Tenant;
  createTransaction: Transaction;
  deleteAccount: Scalars['Void']['output'];
  deleteScraper: Scalars['Void']['output'];
  deleteTenant?: Maybe<Scalars['Void']['output']>;
  deleteTransaction: Scalars['Void']['output'];
  moveAccount: Account;
  noOp: Scalars['Void']['output'];
  setLastSuccessfulScrapedDate: Scalars['DateTime']['output'];
  triggerScraper: ScraperJob;
  upsertScraper: Scraper;
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


export type MutationSetLastSuccessfulScrapedDateArgs = {
  date: Scalars['DateTime']['input'];
  scraperID: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};


export type MutationTriggerScraperArgs = {
  id: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};


export type MutationUpsertScraperArgs = {
  displayName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  parameters: Array<ScraperParameterInput>;
  scraperTypeID: Scalars['ID']['input'];
  tenantID: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  currencies: Array<Currency>;
  currency?: Maybe<Currency>;
  currencyRate?: Maybe<CurrencyRate>;
  currencyRates: Array<CurrencyRate>;
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
  job?: Maybe<ScraperJob>;
  jobs: Array<ScraperJob>;
  lastSuccessfulScrapedDate?: Maybe<Scalars['DateTime']['output']>;
  parameters: Array<ScraperParameter>;
  tenant: Tenant;
  type: ScraperType;
  updatedAt: Scalars['DateTime']['output'];
};


export type ScraperJobArgs = {
  id: Scalars['ID']['input'];
};

export type ScraperJob = {
  __typename?: 'ScraperJob';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  logs: Array<Scalars['String']['output']>;
  parameters: Array<ScraperParameter>;
  scraper: Scraper;
  status: ScraperJobStatus;
};


export type ScraperJobLogsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export enum ScraperJobStatus {
  Failed = 'Failed',
  Pending = 'Pending',
  Running = 'Running',
  Successful = 'Successful'
}

export type ScraperParameter = {
  __typename?: 'ScraperParameter';
  parameter: ScraperTypeParameter;
  value: Scalars['String']['output'];
};

export type ScraperParameterInput = {
  parameterID: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export enum ScraperParameterType {
  Account = 'Account',
  Boolean = 'Boolean',
  Date = 'Date',
  Float = 'Float',
  Integer = 'Integer',
  Password = 'Password',
  String = 'String'
}

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
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  type: ScraperParameterType;
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
  scraper?: Maybe<Scraper>;
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


export type TenantScraperArgs = {
  id: Scalars['ID']['input'];
};


export type TenantScrapersArgs = {
  scraperTypeID?: InputMaybe<Scalars['ID']['input']>;
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
  classification?: Maybe<TransactionClassification>;
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

export type TransactionClassification = {
  __typename?: 'TransactionClassification';
  confidence?: Maybe<Scalars['Float']['output']>;
  reasoning?: Maybe<Scalars['String']['output']>;
  sourceAccount?: Maybe<Account>;
  targetAccount?: Maybe<Account>;
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

export type GetTransactionsCountQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
}>;


export type GetTransactionsCountQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', totalTransactions: number } | null };

export type CreateTransactionMutationVariables = Exact<{
  tx: CreateTransaction;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string } };

export type GetLastSuccessfulScrapedDateQueryVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  scraperID: Scalars['ID']['input'];
}>;


export type GetLastSuccessfulScrapedDateQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', scraper?: { __typename?: 'Scraper', lastSuccessfulScrapedDate?: DateTime | null } | null } | null };

export type SetLastSuccessfulScrapedDateMutationVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  scraperID: Scalars['ID']['input'];
  date: Scalars['DateTime']['input'];
}>;


export type SetLastSuccessfulScrapedDateMutation = { __typename?: 'Mutation', setLastSuccessfulScrapedDate: DateTime };


export const GetTransactionsCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTransactionsCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalTransactions"}}]}}]}}]} as unknown as DocumentNode<GetTransactionsCountQuery, GetTransactionsCountQueryVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tx"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransaction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tx"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tx"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const GetLastSuccessfulScrapedDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLastSuccessfulScrapedDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scraperID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scraper"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scraperID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastSuccessfulScrapedDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetLastSuccessfulScrapedDateQuery, GetLastSuccessfulScrapedDateQueryVariables>;
export const SetLastSuccessfulScrapedDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetLastSuccessfulScrapedDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scraperID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setLastSuccessfulScrapedDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}},{"kind":"Argument","name":{"kind":"Name","value":"scraperID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scraperID"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}]}}]} as unknown as DocumentNode<SetLastSuccessfulScrapedDateMutation, SetLastSuccessfulScrapedDateMutationVariables>;
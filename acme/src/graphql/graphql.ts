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

export type CreateAccountMutationVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  parentID?: InputMaybe<Scalars['ID']['input']>;
  displayName: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AccountType>;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'Account', id: string, displayName: string } };

export type UpsertScraperMutationVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  scraperTypeID: Scalars['ID']['input'];
  displayName: Scalars['String']['input'];
  parameters: Array<ScraperParameterInput> | ScraperParameterInput;
}>;


export type UpsertScraperMutation = { __typename?: 'Mutation', upsertScraper: { __typename?: 'Scraper', id: string } };

export type FindTenantQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindTenantQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', id: string } | null };

export type DeleteTenantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTenantMutation = { __typename?: 'Mutation', deleteTenant?: any | null };

export type CreateTenantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  displayName: Scalars['String']['input'];
}>;


export type CreateTenantMutation = { __typename?: 'Mutation', createTenant: { __typename?: 'Tenant', id: string, displayName: string } };

export type FindTenantAccountsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindTenantAccountsQuery = { __typename?: 'Query', tenant?: { __typename?: 'Tenant', accounts: Array<{ __typename?: 'Account', id: string }> } | null };

export type CreateTransactionMutationVariables = Exact<{
  tenantID: Scalars['ID']['input'];
  date: Scalars['DateTime']['input'];
  sequence: Scalars['Int']['input'];
  referenceID: Scalars['String']['input'];
  description: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  currency: Scalars['String']['input'];
  sourceAccountID?: InputMaybe<Scalars['ID']['input']>;
  targetAccountID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string } };


export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"icon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"parentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"icon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"icon"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpsertScraperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertScraper"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scraperTypeID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScraperParameterInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertScraper"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"scraperTypeID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scraperTypeID"}}},{"kind":"Argument","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}}},{"kind":"Argument","name":{"kind":"Name","value":"parameters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpsertScraperMutation, UpsertScraperMutationVariables>;
export const FindTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FindTenantQuery, FindTenantQueryVariables>;
export const DeleteTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTenantMutation, DeleteTenantMutationVariables>;
export const CreateTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CreateTenantMutation, CreateTenantMutationVariables>;
export const FindTenantAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindTenantAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FindTenantAccountsQuery, FindTenantAccountsQueryVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sequence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"referenceID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sourceAccountID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetAccountID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tx"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"tenantID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantID"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sequence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sequence"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"referenceID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"referenceID"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sourceAccountID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sourceAccountID"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"targetAccountID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetAccountID"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
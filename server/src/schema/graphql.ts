import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DateTime } from "luxon";
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Account: ResolverTypeWrapper<Account>;
  AccountBalanceOverTime: ResolverTypeWrapper<AccountBalanceOverTime>;
  AccountType: AccountType;
  BalancePoint: ResolverTypeWrapper<BalancePoint>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateTransaction: CreateTransaction;
  Currency: ResolverTypeWrapper<Currency>;
  CurrencyRate: ResolverTypeWrapper<CurrencyRate>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Scraper: ResolverTypeWrapper<Scraper>;
  ScraperJob: ResolverTypeWrapper<ScraperJob>;
  ScraperJobStatus: ScraperJobStatus;
  ScraperParameter: ResolverTypeWrapper<ScraperParameter>;
  ScraperParameterInput: ScraperParameterInput;
  ScraperParameterType: ScraperParameterType;
  ScraperType: ResolverTypeWrapper<ScraperType>;
  ScraperTypeParameter: ResolverTypeWrapper<ScraperTypeParameter>;
  SortDirection: SortDirection;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tenant: ResolverTypeWrapper<Tenant>;
  TenantsSortColumns: TenantsSortColumns;
  TenantsSortColumnsInput: TenantsSortColumnsInput;
  Transaction: ResolverTypeWrapper<Transaction>;
  TransactionClassification: ResolverTypeWrapper<TransactionClassification>;
  TransactionsResult: ResolverTypeWrapper<TransactionsResult>;
  TransactionsSortColumns: TransactionsSortColumns;
  TransactionsSortColumnsInput: TransactionsSortColumnsInput;
  Void: ResolverTypeWrapper<Scalars['Void']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account;
  AccountBalanceOverTime: AccountBalanceOverTime;
  BalancePoint: BalancePoint;
  Boolean: Scalars['Boolean']['output'];
  CreateTransaction: CreateTransaction;
  Currency: Currency;
  CurrencyRate: CurrencyRate;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  Scraper: Scraper;
  ScraperJob: ScraperJob;
  ScraperParameter: ScraperParameter;
  ScraperParameterInput: ScraperParameterInput;
  ScraperType: ScraperType;
  ScraperTypeParameter: ScraperTypeParameter;
  String: Scalars['String']['output'];
  Tenant: Tenant;
  TenantsSortColumnsInput: TenantsSortColumnsInput;
  Transaction: Transaction;
  TransactionClassification: TransactionClassification;
  TransactionsResult: TransactionsResult;
  TransactionsSortColumnsInput: TransactionsSortColumnsInput;
  Void: Scalars['Void']['output'];
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<AccountBalanceArgs, 'currency'>>;
  balanceOverTime?: Resolver<Array<ResolversTypes['BalancePoint']>, ParentType, ContextType, RequireFields<AccountBalanceOverTimeArgs, 'currency' | 'endDate' | 'startDate'>>;
  childCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  children?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  incomingTransactions?: Resolver<ResolversTypes['TransactionsResult'], ParentType, ContextType, Partial<AccountIncomingTransactionsArgs>>;
  outgoingTransactions?: Resolver<ResolversTypes['TransactionsResult'], ParentType, ContextType, Partial<AccountOutgoingTransactionsArgs>>;
  parent?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>;
  transactions?: Resolver<ResolversTypes['TransactionsResult'], ParentType, ContextType, Partial<AccountTransactionsArgs>>;
  type?: Resolver<Maybe<ResolversTypes['AccountType']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountBalanceOverTimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountBalanceOverTime'] = ResolversParentTypes['AccountBalanceOverTime']> = {
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  points?: Resolver<Array<ResolversTypes['BalancePoint']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BalancePointResolvers<ContextType = any, ParentType extends ResolversParentTypes['BalancePoint'] = ResolversParentTypes['BalancePoint']> = {
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrencyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Currency'] = ResolversParentTypes['Currency']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  countries?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  decimalDigits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  namePlural?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nativeSymbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrencyRateResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurrencyRate'] = ResolversParentTypes['CurrencyRate']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  rate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sourceCurrency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  targetCurrency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationCreateAccountArgs, 'displayName' | 'tenantID'>>;
  createCurrencyRate?: Resolver<ResolversTypes['CurrencyRate'], ParentType, ContextType, RequireFields<MutationCreateCurrencyRateArgs, 'date' | 'rate' | 'sourceCurrencyCode' | 'targetCurrencyCode'>>;
  createTenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType, RequireFields<MutationCreateTenantArgs, 'displayName' | 'id'>>;
  createTransaction?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationCreateTransactionArgs, 'tx'>>;
  deleteAccount?: Resolver<ResolversTypes['Void'], ParentType, ContextType, RequireFields<MutationDeleteAccountArgs, 'id' | 'tenantID'>>;
  deleteScraper?: Resolver<ResolversTypes['Void'], ParentType, ContextType, RequireFields<MutationDeleteScraperArgs, 'id' | 'tenantID'>>;
  deleteTenant?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationDeleteTenantArgs, 'id'>>;
  deleteTransaction?: Resolver<ResolversTypes['Void'], ParentType, ContextType, RequireFields<MutationDeleteTransactionArgs, 'id' | 'tenantID'>>;
  moveAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationMoveAccountArgs, 'accountID' | 'tenantID'>>;
  noOp?: Resolver<ResolversTypes['Void'], ParentType, ContextType>;
  setLastSuccessfulScrapedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType, RequireFields<MutationSetLastSuccessfulScrapedDateArgs, 'date' | 'scraperID' | 'tenantID'>>;
  triggerScraper?: Resolver<ResolversTypes['ScraperJob'], ParentType, ContextType, RequireFields<MutationTriggerScraperArgs, 'id' | 'tenantID'>>;
  upsertScraper?: Resolver<ResolversTypes['Scraper'], ParentType, ContextType, RequireFields<MutationUpsertScraperArgs, 'displayName' | 'parameters' | 'scraperTypeID' | 'tenantID'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currencies?: Resolver<Array<ResolversTypes['Currency']>, ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType, RequireFields<QueryCurrencyArgs, 'code'>>;
  currencyRate?: Resolver<Maybe<ResolversTypes['CurrencyRate']>, ParentType, ContextType, RequireFields<QueryCurrencyRateArgs, 'date' | 'sourceCurrencyCode' | 'targetCurrencyCode'>>;
  currencyRates?: Resolver<Array<ResolversTypes['CurrencyRate']>, ParentType, ContextType, Partial<QueryCurrencyRatesArgs>>;
  scraperTypes?: Resolver<Array<ResolversTypes['ScraperType']>, ParentType, ContextType>;
  tenant?: Resolver<Maybe<ResolversTypes['Tenant']>, ParentType, ContextType, RequireFields<QueryTenantArgs, 'id'>>;
  tenants?: Resolver<Array<ResolversTypes['Tenant']>, ParentType, ContextType, Partial<QueryTenantsArgs>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ScraperResolvers<ContextType = any, ParentType extends ResolversParentTypes['Scraper'] = ResolversParentTypes['Scraper']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  job?: Resolver<Maybe<ResolversTypes['ScraperJob']>, ParentType, ContextType, RequireFields<ScraperJobArgs, 'id'>>;
  jobs?: Resolver<Array<ResolversTypes['ScraperJob']>, ParentType, ContextType>;
  lastSuccessfulScrapedDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  parameters?: Resolver<Array<ResolversTypes['ScraperParameter']>, ParentType, ContextType>;
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ScraperType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScraperJobResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScraperJob'] = ResolversParentTypes['ScraperJob']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, Partial<ScraperJobLogsArgs>>;
  parameters?: Resolver<Array<ResolversTypes['ScraperParameter']>, ParentType, ContextType>;
  scraper?: Resolver<ResolversTypes['Scraper'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ScraperJobStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScraperParameterResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScraperParameter'] = ResolversParentTypes['ScraperParameter']> = {
  parameter?: Resolver<ResolversTypes['ScraperTypeParameter'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScraperTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScraperType'] = ResolversParentTypes['ScraperType']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parameters?: Resolver<Array<ResolversTypes['ScraperTypeParameter']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScraperTypeParameterResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScraperTypeParameter'] = ResolversParentTypes['ScraperTypeParameter']> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ScraperParameterType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TenantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tenant'] = ResolversParentTypes['Tenant']> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<TenantAccountArgs, 'id'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, Partial<TenantAccountsArgs>>;
  accountsBalanceOverTime?: Resolver<Array<ResolversTypes['AccountBalanceOverTime']>, ParentType, ContextType, RequireFields<TenantAccountsBalanceOverTimeArgs, 'accountIDs' | 'currency'>>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstTransactionDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastTransactionDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  rootAccounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
  scraper?: Resolver<Maybe<ResolversTypes['Scraper']>, ParentType, ContextType, RequireFields<TenantScraperArgs, 'id'>>;
  scrapers?: Resolver<Array<ResolversTypes['Scraper']>, ParentType, ContextType, Partial<TenantScrapersArgs>>;
  totalTransactions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<TenantTransactionArgs, 'id'>>;
  transactions?: Resolver<ResolversTypes['TransactionsResult'], ParentType, ContextType, Partial<TenantTransactionsArgs>>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  classification?: Resolver<Maybe<ResolversTypes['TransactionClassification']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  referenceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sequence?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sourceAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  targetAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionClassificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionClassification'] = ResolversParentTypes['TransactionClassification']> = {
  confidence?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  reasoning?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceAccount?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  targetAccount?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionsResult'] = ResolversParentTypes['TransactionsResult']> = {
  rows?: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = any> = {
  Account?: AccountResolvers<ContextType>;
  AccountBalanceOverTime?: AccountBalanceOverTimeResolvers<ContextType>;
  BalancePoint?: BalancePointResolvers<ContextType>;
  Currency?: CurrencyResolvers<ContextType>;
  CurrencyRate?: CurrencyRateResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Scraper?: ScraperResolvers<ContextType>;
  ScraperJob?: ScraperJobResolvers<ContextType>;
  ScraperParameter?: ScraperParameterResolvers<ContextType>;
  ScraperType?: ScraperTypeResolvers<ContextType>;
  ScraperTypeParameter?: ScraperTypeParameterResolvers<ContextType>;
  Tenant?: TenantResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  TransactionClassification?: TransactionClassificationResolvers<ContextType>;
  TransactionsResult?: TransactionsResultResolvers<ContextType>;
  Void?: GraphQLScalarType;
};


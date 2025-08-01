import {
    Account,
    AccountBalanceArgs,
    AccountBalanceOverTime,
    AccountBalanceOverTimeArgs,
    BalancePoint,
    Currency,
    CurrencyRate,
    MutationCreateAccountArgs,
    MutationCreateCurrencyRateArgs,
    MutationCreateScraperArgs,
    MutationCreateTenantArgs,
    MutationCreateTransactionArgs,
    MutationDeleteAccountArgs,
    MutationDeleteScraperArgs,
    MutationDeleteTenantArgs,
    MutationDeleteTransactionArgs,
    MutationMoveAccountArgs,
    QueryTenantsArgs,
    Scraper,
    ScraperParameter,
    ScraperParameterType,
    ScraperType,
    ScraperTypeParameter,
    Tenant,
    TenantAccountsArgs,
    TenantAccountsBalanceOverTimeArgs,
    TenantTransactionsArgs,
    Transaction,
    TransactionsResult,
} from "../schema/graphql.js"
import DataLoader from "dataloader"
import { AccountsDataAccessLayer } from "./accounts.js"
import { CurrenciesDataAccessLayer } from "./currencies.js"
import { ScrapersDataAccessLayer } from "./scrapers.js"
import { TenantsDataAccessLayer } from "./tenants.js"
import { TransactionsDataAccessLayer, TransactionsSummaryResult } from "./transactions.js"
import { DateTime } from "luxon"

export interface AccountKey {
    tenantID: Tenant["id"]
    accountID: Account["id"]
}

export interface AccountsKey extends TenantAccountsArgs {
    tenantID: Tenant["id"]
}

export interface CurrencyRateKey {
    date: CurrencyRate["date"],
    sourceCurrencyCode: Currency["code"],
    targetCurrencyCode: Currency["code"],
}

export interface ScraperTypeParameterKey {
    scraperTypeID: ScraperType["id"],
    scraperTypeParameterID: ScraperTypeParameter["id"],
}

export interface ScraperKey {
    tenantID: Tenant["id"],
    scraperTypeID: ScraperType["id"],
    id: Scraper["id"],
}

export interface TransactionKey {
    tenantID: string
    txID: string
}

export interface TransactionsKey extends TenantTransactionsArgs {
    tenantID: string
    direction?: "incoming" | "outgoing" | "all"
}

export interface DataLayer {
    createAccount(args: MutationCreateAccountArgs): Promise<Account>

    createCurrencyRate(args: MutationCreateCurrencyRateArgs): Promise<CurrencyRate>

    createScraper(args: MutationCreateScraperArgs): Promise<Scraper>

    createTenant(args: MutationCreateTenantArgs): Promise<Tenant>

    createTransaction(args: MutationCreateTransactionArgs): Promise<Transaction>

    deleteAccount(args: MutationDeleteAccountArgs): Promise<void>

    deleteScraper(args: MutationDeleteScraperArgs): Promise<void>

    deleteTenant(args: MutationDeleteTenantArgs): Promise<void>

    deleteTransaction(args: MutationDeleteTransactionArgs): Promise<void>

    fetchAccount(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account | null>

    fetchAccountBalance(tenantID: Tenant["id"], accountID: Account["id"], args: AccountBalanceArgs): Promise<number>

    fetchAccountBalanceOverTime(tenantID: Tenant["id"],
        accountID: Account["id"],
        args: AccountBalanceOverTimeArgs): Promise<BalancePoint[]>

    fetchAccountChildren(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account[]>

    fetchAccounts(tenantID: Tenant["id"], filter?: string | null): Promise<Account[]>

    fetchAccountsBalanceOverTime(tenantID: Tenant["id"],
        args: TenantAccountsBalanceOverTimeArgs): Promise<AccountBalanceOverTime[]>

    fetchCurrency(code: Currency["code"]): Promise<Currency | null>

    fetchCurrencies(): Promise<Currency[]>

    fetchCurrencyRate(date: CurrencyRate["date"],
        sourceCurrencyCode: Currency["code"],
        targetCurrencyCode: Currency["code"]): Promise<CurrencyRate | null>

    fetchCurrencyRates(startDate?: CurrencyRate["date"],
        endDate?: CurrencyRate["date"],
        sourceCurrencyCode?: Currency["code"],
        targetCurrencyCode?: Currency["code"]): Promise<CurrencyRate[]>

    fetchRootAccounts(tenantID: Tenant["id"]): Promise<Account[]>

    fetchScraperParameterType(id: ScraperParameterType["id"]): Promise<ScraperParameterType | null>

    fetchScraperParameterTypes(): Promise<ScraperParameterType[]>

    fetchScraperType(scraperTypeID: ScraperType["id"]): Promise<ScraperType | null>

    fetchScraperTypes(): Promise<ScraperType[]>

    fetchScraperTypeParameter(scraperTypeID: ScraperType["id"],
        scraperTypeParameterID: ScraperTypeParameter["id"]): Promise<ScraperTypeParameter | null>

    fetchScraperTypeParameters(scraperTypeID: ScraperType["id"]): Promise<ScraperTypeParameter[]>

    fetchScraper(tenantID: Tenant["id"], scraperTypeID: ScraperType["id"], id: Scraper["id"]): Promise<Scraper | null>

    fetchScrapers(tenantID: Tenant["id"]): Promise<Scraper[]>

    fetchScraperParameters(tenantID: Tenant["id"],
        scraperTypeID: ScraperType["id"],
        id: Scraper["id"]): Promise<ScraperParameter[]>

    fetchTenants(args: QueryTenantsArgs): Promise<Tenant[]>

    fetchTenant(id: Tenant["id"]): Promise<Tenant | null>

    fetchTransaction(tenantID: Tenant["id"], txID: Transaction["id"]): Promise<Transaction | null>

    fetchTransactions(tenantID: Tenant["id"],
        direction: TransactionsKey["direction"],
        args: TenantTransactionsArgs): Promise<TransactionsResult>

    fetchTransactionsSummary(tenantID: Tenant["id"]): Promise<TransactionsSummaryResult>

    moveAccount(args: MutationMoveAccountArgs): Promise<Account>
}

export class NoOpDataLayer {
    createAccount(args: MutationCreateAccountArgs): Promise<Account> {
        throw new Error("Not implemented")
    }

    createCurrencyRate(args: MutationCreateCurrencyRateArgs): Promise<CurrencyRate> {
        throw new Error("Not implemented")
    }

    createScraper(args: MutationCreateScraperArgs): Promise<Scraper> {
        throw new Error("Not implemented")
    }

    createTenant(args: MutationCreateTenantArgs): Promise<Tenant> {
        throw new Error("Not implemented")
    }

    createTransaction(args: MutationCreateTransactionArgs): Promise<Transaction> {
        throw new Error("Not implemented")
    }

    deleteAccount(args: MutationDeleteAccountArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    deleteScraper(args: MutationDeleteScraperArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    deleteTenant(args: MutationDeleteTenantArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    deleteTransaction(args: MutationDeleteTransactionArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    fetchAccount(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account | null> {
        throw new Error("Not implemented")
    }

    fetchAccountBalance(tenantID: Tenant["id"], accountID: Account["id"], args: AccountBalanceArgs): Promise<number> {
        throw new Error("Not implemented")
    }

    fetchAccountBalanceOverTime(tenantID: Tenant["id"],
        accountID: Account["id"],
        args: AccountBalanceOverTimeArgs): Promise<BalancePoint[]> {
        throw new Error("Not implemented")
    }

    fetchAccountChildren(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account[]> {
        throw new Error("Not implemented")
    }

    fetchAccounts(tenantID: Tenant["id"], filter?: string | null): Promise<Account[]> {
        throw new Error("Not implemented")
    }

    fetchAccountsBalanceOverTime(tenantID: Tenant["id"],
        args: TenantAccountsBalanceOverTimeArgs): Promise<AccountBalanceOverTime[]> {
        throw new Error("Not implemented")
    }

    fetchCurrency(code: Currency["code"]): Promise<Currency | null> {
        throw new Error("Not implemented")
    }

    fetchCurrencies(): Promise<Currency[]> {
        throw new Error("Not implemented")
    }

    fetchCurrencyRate(date: CurrencyRate["date"],
        sourceCurrencyCode: Currency["code"],
        targetCurrencyCode: Currency["code"]): Promise<CurrencyRate | null> {
        throw new Error("Not implemented")
    }

    fetchCurrencyRates(startDate?: CurrencyRate["date"],
        endDate?: CurrencyRate["date"],
        sourceCurrencyCode?: Currency["code"],
        targetCurrencyCode?: Currency["code"]): Promise<CurrencyRate[]> {
        throw new Error("Not implemented")
    }

    fetchRootAccounts(tenantID: Tenant["id"]): Promise<Account[]> {
        throw new Error("Not implemented")
    }

    fetchScraperParameterType(id: ScraperParameterType["id"]): Promise<ScraperParameterType | null> {
        throw new Error("Not implemented")
    }

    fetchScraperParameterTypes(): Promise<ScraperParameterType[]> {
        throw new Error("Not implemented")
    }

    fetchScraperType(scraperTypeID: ScraperType["id"]): Promise<ScraperType | null> {
        throw new Error("Not implemented")
    }

    fetchScraperTypes(): Promise<ScraperType[]> {
        throw new Error("Not implemented")
    }

    fetchScraperTypeParameter(scraperTypeID: ScraperType["id"],
        scraperTypeParameterID: ScraperTypeParameter["id"]): Promise<ScraperTypeParameter | null> {
        throw new Error("Not implemented")
    }

    fetchScraperTypeParameters(scraperTypeID: ScraperType["id"]): Promise<ScraperTypeParameter[]> {
        throw new Error("Not implemented")
    }

    fetchTransaction(_tenantID: Tenant["id"], _txID: Transaction["id"]): Promise<Transaction | null> {
        throw new Error("Not implemented")
    }

    fetchScraper(tenantID: Tenant["id"], scraperTypeID: ScraperType["id"], id: Scraper["id"]): Promise<Scraper | null> {
        throw new Error("Not implemented")
    }

    fetchScrapers(tenantID: Tenant["id"]): Promise<Scraper[]> {
        throw new Error("Not implemented")
    }

    fetchScraperParameters(tenantID: Tenant["id"],
        scraperTypeID: ScraperType["id"],
        id: Scraper["id"]): Promise<ScraperParameter[]> {
        throw new Error("Not implemented")
    }

    fetchTenants(args: QueryTenantsArgs): Promise<Tenant[]> {
        throw new Error("Not implemented")
    }

    fetchTenant(id: Tenant["id"]): Promise<Tenant | null> {
        throw new Error("Not implemented")
    }

    fetchTransactions(tenantID: Tenant["id"],
        direction: TransactionsKey["direction"],
        args: TenantTransactionsArgs): Promise<TransactionsResult> {
        throw new Error("Not implemented")
    }

    fetchTransactionsSummary(tenantID: Tenant["id"]): Promise<TransactionsSummaryResult> {
        throw new Error("Not implemented")
    }

    moveAccount(args: MutationMoveAccountArgs): Promise<Account> {
        throw new Error("Not implemented")
    }
}

export class DataLayerImpl implements DataLayer {
    private readonly currency: DataLoader<Currency["code"], Currency | null>
    private readonly currencyRate: DataLoader<CurrencyRateKey, CurrencyRate | null>
    private readonly scraperParameterType: DataLoader<ScraperParameterType["id"], ScraperParameterType | null>
    private readonly scraperType: DataLoader<ScraperType["id"], ScraperType | null>
    private readonly scraperTypeParameter: DataLoader<ScraperTypeParameterKey, ScraperTypeParameter | null>
    private readonly scraperTypeParameters: DataLoader<ScraperType["id"], ScraperTypeParameter[]>
    private readonly scraper: DataLoader<ScraperKey, Scraper | null>
    private readonly scraperParameters: DataLoader<ScraperKey, ScraperParameter[]>
    private readonly tenant: DataLoader<Tenant["id"], Tenant | null>
    private readonly rootAccounts: DataLoader<Tenant["id"], Account[]>
    private readonly account: DataLoader<AccountKey, Account | null>
    private readonly accounts: DataLoader<AccountsKey, Account[], string>
    private readonly accountChildren: DataLoader<AccountKey, Account[], string>
    private readonly transaction: DataLoader<TransactionKey, Transaction | null, string>
    private readonly transactions: DataLoader<TransactionsKey, TransactionsResult, string>
    private readonly transactionsSummary: DataLoader<Tenant["id"], TransactionsSummaryResult, string>

    constructor(
        private readonly accountsDAO: AccountsDataAccessLayer,
        private readonly currenciesDAO: CurrenciesDataAccessLayer,
        private readonly scrapersDAO: ScrapersDataAccessLayer,
        private readonly tenantsDAO: TenantsDataAccessLayer,
        private readonly transactionsDAO: TransactionsDataAccessLayer,
    ) {

        this.currency = new DataLoader<Currency["code"], Currency | null>(
            async (keys: readonly Currency["code"][]): Promise<(Currency | null)[]> => {
                const rowsPerKey = new Map<Currency["code"], Currency | null>()
                for (const code of keys) {
                    rowsPerKey.set(code, await this.currenciesDAO.fetchCurrency(code))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "currency" },
        )

        this.currencyRate = new DataLoader<CurrencyRateKey, CurrencyRate | null>(
            async (keys: readonly CurrencyRateKey[]): Promise<(CurrencyRate | null)[]> => {
                const rowsPerKey = new Map<CurrencyRateKey, CurrencyRate | null>()
                for (const key of keys) {
                    rowsPerKey.set(
                        key,
                        await this.currenciesDAO.fetchCurrencyRate(
                            key.date,
                            key.sourceCurrencyCode,
                            key.targetCurrencyCode,
                        ))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "currencyRate" },
        )

        this.scraperParameterType = new DataLoader<ScraperParameterType["id"], ScraperParameterType | null>(
            async (keys: readonly ScraperParameterType["id"][]): Promise<(ScraperParameterType | null)[]> => {
                const rowsPerKey = new Map<Tenant["id"], ScraperParameterType | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.scrapersDAO.fetchScraperParameterType(k))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "scraperParameterType" },
        )

        this.scraperType = new DataLoader<ScraperType["id"], ScraperType | null>(
            async (keys: readonly ScraperType["id"][]): Promise<(ScraperType | null)[]> => {
                const rowsPerKey = new Map<Tenant["id"], ScraperType | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.scrapersDAO.fetchScraperType(k))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "scraperType" },
        )

        this.scraperTypeParameter = new DataLoader<ScraperTypeParameterKey, ScraperTypeParameter | null>(
            async (keys: readonly ScraperTypeParameterKey[]): Promise<(ScraperTypeParameter | null)[]> => {
                const rowsPerKey = new Map<ScraperTypeParameterKey, ScraperTypeParameter | null>()
                for (const k of keys) {
                    rowsPerKey.set(
                        k,
                        await this.scrapersDAO.fetchScraperTypeParameter(
                            k.scraperTypeID,
                            k.scraperTypeParameterID,
                        ),
                    )
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "scraperTypeParameter" },
        )

        this.scraperTypeParameters = new DataLoader<ScraperType["id"], ScraperTypeParameter[]>(
            async (keys: readonly ScraperType["id"][]): Promise<(ScraperTypeParameter[])[]> => {
                const rowsPerKey = new Map<ScraperType["id"], ScraperTypeParameter[]>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.scrapersDAO.fetchScraperTypeParameters(k))
                }
                return keys.map(k => rowsPerKey.get(k) || [])
            },
            { name: "scraperTypeParameters" },
        )

        this.scraper = new DataLoader<ScraperKey, Scraper | null>(
            async (keys: readonly ScraperKey[]): Promise<(Scraper | null)[]> => {
                const rowsPerKey = new Map<ScraperKey, Scraper | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.scrapersDAO.fetchScraper(k.tenantID, k.scraperTypeID, k.id))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "scraper" },
        )

        this.scraperParameters = new DataLoader<ScraperKey, ScraperParameter[]>(
            async (keys: readonly ScraperKey[]): Promise<ScraperParameter[][]> => {
                const rowsPerKey = new Map<ScraperKey, ScraperParameter[]>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.scrapersDAO.fetchScraperParameters(k.tenantID, k.scraperTypeID, k.id))
                }
                return keys.map(k => rowsPerKey.get(k) || [])
            },
            { name: "scraperParameters" },
        )

        this.tenant = new DataLoader<Tenant["id"], Tenant | null>(
            async (keys: readonly Tenant["id"][]): Promise<(Tenant | null)[]> => {
                const rowsPerKey = new Map<Tenant["id"], Tenant | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.tenantsDAO.fetchTenant(k))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "tenant" },
        )

        this.rootAccounts = new DataLoader<Tenant["id"], Account[]>(
            async (keys: readonly Tenant["id"][]): Promise<(Account[])[]> => {
                const rowsPerKey = new Map<Tenant["id"], Account[]>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.accountsDAO.fetchRootAccounts(k))
                }
                return keys.map(k => rowsPerKey.get(k) || [])
            },
            { name: "rootAccounts" },
        )

        this.account = new DataLoader<AccountKey, Account | null>(
            async (keys: readonly AccountKey[]): Promise<(Account | null)[]> => {
                const rowsPerKey = new Map<AccountKey, Account | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.accountsDAO.fetchAccount(k.tenantID, k.accountID))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "account" },
        )

        this.accounts = new DataLoader<AccountsKey, Account[]>(
            async (keys: readonly AccountsKey[]): Promise<(Account[])[]> => {
                const rowsPerKey = new Map<AccountsKey, Account[]>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.accountsDAO.fetchAccounts(k.tenantID, k.filter))
                }
                return keys.map(k => rowsPerKey.get(k) || [])
            },
            { name: "accounts" },
        )

        this.accountChildren = new DataLoader<AccountKey, Account[]>(
            async (keys: readonly AccountKey[]): Promise<Account[][]> => {
                const rowsPerKey = new Map<AccountKey, Account[]>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.accountsDAO.fetchChildAccounts(k.tenantID, k.accountID))
                }
                return keys.map(k => rowsPerKey.get(k) || [])
            },
            { name: "childAccounts" },
        )

        this.transaction = new DataLoader<TransactionKey, Transaction | null>(
            async (keys: readonly TransactionKey[]): Promise<(Transaction | null)[]> => {
                const rowsPerKey = new Map<TransactionKey, Transaction | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.transactionsDAO.fetchTransaction(k.tenantID, k.txID))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "transaction" },
        )

        this.transactions = new DataLoader<TransactionsKey, TransactionsResult>(
            async (keys: readonly TransactionsKey[]): Promise<TransactionsResult[]> => {
                const rowsPerKey = new Map<TransactionsKey, TransactionsResult>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.transactionsDAO.fetchTransactions(k.tenantID, k.direction, k))
                }
                return keys.map(k => rowsPerKey.get(k)!)
            },
            { name: "transactions" },
        )

        this.transactionsSummary = new DataLoader<Tenant["id"], TransactionsSummaryResult>(
            async (keys: readonly Tenant["id"][]): Promise<TransactionsSummaryResult[]> => {
                const rowsPerKey = new Map<Tenant["id"], TransactionsSummaryResult>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.transactionsDAO.fetchTransactionsSummary(k))
                }
                return keys.map(k => rowsPerKey.get(k)!)
            },
            { name: "transactionsSummary" },
        )
    }

    async createAccount(args: MutationCreateAccountArgs): Promise<Account> {
        const row = await this.accountsDAO.createAccount(args)
        this.account.prime({ tenantID: args.tenantID, accountID: row.id }, row)
        return row
    }

    async createCurrencyRate(args: MutationCreateCurrencyRateArgs): Promise<CurrencyRate> {
        const rate = this.currenciesDAO.createCurrencyRate(
            args.date,
            args.sourceCurrencyCode,
            args.targetCurrencyCode,
            args.rate,
        )
        this.currencyRate.prime(
            {
                date: args.date,
                sourceCurrencyCode: args.sourceCurrencyCode,
                targetCurrencyCode: args.targetCurrencyCode,
            },
            rate,
        )
        return rate
    }

    async createScraper(args: MutationCreateScraperArgs): Promise<Scraper> {
        const row = await this.scrapersDAO.createScraper(args)
        this.scraper.prime({
            tenantID: args.tenantID,
            scraperTypeID: args.scraperTypeID,
            id: row.id,
        }, row)
        return row
    }

    async createTenant(args: MutationCreateTenantArgs): Promise<Tenant> {
        const row = await this.tenantsDAO.createTenant(this.accountsDAO, args)
        this.tenant.prime(row.id, row)
        return row
    }

    async createTransaction(args: MutationCreateTransactionArgs): Promise<Transaction> {
        const row = await this.transactionsDAO.createTransaction(args.tx)
        this.transaction.prime({ tenantID: args.tx.tenantID, txID: row.id }, row)
        return row
    }

    async deleteAccount(args: MutationDeleteAccountArgs): Promise<void> {
        await this.accountsDAO.deleteAccount(args.tenantID, args.id)
        this.account.clear({ tenantID: args.tenantID, accountID: args.id })
    }

    async deleteScraper(args: MutationDeleteScraperArgs): Promise<void> {
        const row = await this.scrapersDAO.deleteScraper(args)
        this.scraper.clear({ tenantID: args.tenantID, scraperTypeID: args.scraperTypeID, id: args.id })
        return row
    }

    async deleteTenant(args: MutationDeleteTenantArgs): Promise<void> {
        const row = await this.tenantsDAO.deleteTenant(args)
        this.tenant.clear(args.id)
        this.accounts.clear({ tenantID: args.id })
        this.rootAccounts.clear(args.id)
        this.transactionsSummary.clear(args.id)
        return row
    }

    async deleteTransaction(args: MutationDeleteTransactionArgs): Promise<void> {
        await this.transactionsDAO.deleteTransaction(args.tenantID, args.id)
        this.transaction.clear({ tenantID: args.tenantID, txID: args.id })
    }

    async fetchAccount(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account | null> {
        return this.account.load({ tenantID, accountID })
    }

    async fetchAccountBalance(
        tenantID: Tenant["id"],
        accountID: Account["id"],
        args: AccountBalanceArgs,
    ): Promise<number> {
        return await this.accountsDAO.fetchAccountBalance(tenantID, accountID, args)
    }

    async fetchAccountBalanceOverTime(
        tenantID: Tenant["id"],
        accountID: Account["id"],
        args: AccountBalanceOverTimeArgs,
    ): Promise<BalancePoint[]> {
        return await this.accountsDAO.fetchAccountBalanceOverTime(tenantID, accountID, args)
    }

    async fetchAccountChildren(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account[]> {
        const accounts = await this.accountChildren.load({ tenantID, accountID })
        accounts.forEach(a => this.account.prime({ tenantID, accountID: a.id }, a))
        return accounts
    }

    async fetchAccounts(tenantID: Tenant["id"], filter?: string | null): Promise<Account[]> {
        const accounts = await this.accounts.load({ tenantID, filter })
        accounts.forEach(a => this.account.prime({ tenantID, accountID: a.id }, a))
        return accounts
    }

    async fetchAccountsBalanceOverTime(
        tenantID: Tenant["id"],
        args: TenantAccountsBalanceOverTimeArgs,
    ): Promise<AccountBalanceOverTime[]> {
        const txSummary = await this.transactionsSummary.load(tenantID)
        return this.accountsDAO.fetchAccountsBalanceOverTime(tenantID,
            args.accountIDs,
            args.currency,
            args.startDate || txSummary.firstTransactionDate || DateTime.now().minus({ days: 90 }),
            args.endDate || DateTime.now(),
        )
    }

    async fetchCurrency(code: Currency["code"]): Promise<Currency | null> {
        return this.currency.load(code)
    }

    async fetchCurrencies(): Promise<Currency[]> {
        return this.currenciesDAO.fetchCurrencies()
    }

    async fetchCurrencyRate(
        date: CurrencyRate["date"],
        sourceCurrencyCode: Currency["code"],
        targetCurrencyCode: Currency["code"],
    ): Promise<CurrencyRate | null> {
        return this.currencyRate.load({ date, sourceCurrencyCode, targetCurrencyCode })
    }

    async fetchCurrencyRates(
        startDate?: CurrencyRate["date"],
        endDate?: CurrencyRate["date"],
        sourceCurrencyCode?: Currency["code"],
        targetCurrencyCode?: Currency["code"],
    ): Promise<CurrencyRate[]> {
        return this.currenciesDAO.fetchCurrencyRates(
            startDate,
            endDate,
            sourceCurrencyCode,
            targetCurrencyCode,
        )
    }

    async fetchRootAccounts(tenantID: Tenant["id"]): Promise<Account[]> {
        const accounts = await this.rootAccounts.load(tenantID)
        accounts.forEach(a => this.account.prime({ tenantID, accountID: a.id }, a))
        return accounts
    }

    async fetchScraperParameterType(id: ScraperParameterType["id"]): Promise<ScraperParameterType | null> {
        return this.scraperParameterType.load(id)
    }

    async fetchScraperParameterTypes(): Promise<ScraperParameterType[]> {
        const parameterTypes = await this.scrapersDAO.fetchScraperParameterTypes()
        parameterTypes.forEach(pt => this.scraperParameterType.prime(pt.id, pt))
        return parameterTypes
    }

    async fetchScraperType(scraperTypeID: ScraperType["id"]): Promise<ScraperType | null> {
        return this.scraperType.load(scraperTypeID)
    }

    async fetchScraperTypes(): Promise<ScraperType[]> {
        const scraperTypes = await this.scrapersDAO.fetchScraperTypes()
        scraperTypes.forEach(st => this.scraperType.prime(st.id, st))
        return scraperTypes
    }

    async fetchScraperTypeParameter(
        scraperTypeID: ScraperType["id"],
        scraperTypeParameterID: ScraperTypeParameter["id"],
    ): Promise<ScraperTypeParameter | null> {
        return this.scraperTypeParameter.load({
            scraperTypeID,
            scraperTypeParameterID,
        })
    }

    async fetchScraperTypeParameters(scraperTypeID: ScraperType["id"]): Promise<ScraperTypeParameter[]> {
        const parameters = await this.scrapersDAO.fetchScraperTypeParameters(scraperTypeID)
        parameters.forEach(p => this.scraperTypeParameter.prime({
            scraperTypeID: scraperTypeID,
            scraperTypeParameterID: p.id,
        }, p))
        this.scraperTypeParameters.prime(scraperTypeID, parameters)
        return parameters
    }

    async fetchScraper(
        tenantID: Tenant["id"],
        scraperTypeID: ScraperType["id"],
        id: Scraper["id"],
    ): Promise<Scraper | null> {
        return this.scraper.load({ tenantID, scraperTypeID, id })
    }

    async fetchScrapers(tenantID: Tenant["id"]): Promise<Scraper[]> {
        return this.scrapersDAO.fetchScrapers(tenantID)
    }

    async fetchScraperParameters(
        tenantID: Tenant["id"],
        scraperTypeID: ScraperType["id"],
        id: Scraper["id"],
    ): Promise<ScraperParameter[]> {
        const parameters = await this.scrapersDAO.fetchScraperParameters(tenantID, scraperTypeID, id)
        this.scraperParameters.prime({ tenantID, scraperTypeID, id }, parameters)
        return parameters
    }

    async fetchTenants(args: QueryTenantsArgs): Promise<Tenant[]> {
        const tenants = await this.tenantsDAO.fetchTenants(args)
        tenants.forEach(t => this.tenant.prime(t.id, t))
        return tenants
    }

    async fetchTenant(id: Tenant["id"]): Promise<Tenant | null> {
        return this.tenant.load(id)
    }

    async fetchTransaction(tenantID: Tenant["id"], txID: Transaction["id"]): Promise<Transaction | null> {
        return await this.transaction.load({ tenantID, txID })
    }

    async fetchTransactions(
        tenantID: Tenant["id"],
        direction: TransactionsKey["direction"],
        args: TenantTransactionsArgs,
    ): Promise<TransactionsResult> {
        return await this.transactions.load({ tenantID, direction, ...args })
    }

    async fetchTransactionsSummary(tenantID: Tenant["id"]): Promise<TransactionsSummaryResult> {
        return await this.transactionsSummary.load(tenantID)
    }

    async moveAccount(args: MutationMoveAccountArgs): Promise<Account> {
        const row = await this.accountsDAO.moveAccount(
            args.tenantID,
            args.accountID,
            args.targetParentAccountID || null,
        )
        this.account.prime({ tenantID: args.tenantID, accountID: row.id }, row)
        this.accountChildren.clearAll()
        return row
    }
}

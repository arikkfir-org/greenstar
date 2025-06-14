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
    MutationCreateTenantArgs,
    MutationCreateTransactionArgs,
    MutationDeleteAccountArgs,
    MutationDeleteScraperArgs,
    MutationDeleteTenantArgs,
    MutationDeleteTransactionArgs,
    MutationMoveAccountArgs,
    MutationUpsertScraperArgs,
    QueryTenantsArgs,
    Scraper,
    ScraperJob,
    ScraperType,
    Tenant,
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

export interface CurrencyRateKey {
    date: CurrencyRate["date"],
    sourceCurrencyCode: Currency["code"],
    targetCurrencyCode: Currency["code"],
}

export interface ScraperKey {
    tenantID: Tenant["id"],
    id: Scraper["id"],
}

export interface TransactionsKey extends TenantTransactionsArgs {
    tenantID: string
    direction?: "incoming" | "outgoing" | "all"
}

export interface DataLayer {
    createAccount(args: MutationCreateAccountArgs): Promise<Account>

    createCurrencyRate(args: MutationCreateCurrencyRateArgs): Promise<CurrencyRate>

    upsertScraper(args: MutationUpsertScraperArgs): Promise<Scraper>

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

    fetchScraperType(scraperTypeID: ScraperType["id"]): Promise<ScraperType | null>

    fetchScraperTypes(): Promise<ScraperType[]>

    fetchScraper(tenantID: Tenant["id"], id: Scraper["id"]): Promise<Scraper | null>

    fetchScrapers(tenantID: Tenant["id"], scraperTypeID?: ScraperType["id"]): Promise<Scraper[]>

    fetchTenants(args: QueryTenantsArgs): Promise<Tenant[]>

    fetchTenant(id: Tenant["id"]): Promise<Tenant | null>

    fetchTransaction(tenantID: Tenant["id"], txID: Transaction["id"]): Promise<Transaction | null>

    fetchTransactions(tenantID: Tenant["id"],
        direction: TransactionsKey["direction"],
        args: TenantTransactionsArgs): Promise<TransactionsResult>

    fetchTransactionsSummary(tenantID: Tenant["id"]): Promise<TransactionsSummaryResult>

    moveAccount(args: MutationMoveAccountArgs): Promise<Account>

    fetchScraperJob(tenantID: Tenant["id"], id: ScraperJob["id"]): Promise<ScraperJob | null>

    fetchScraperJobs(tenantID: Tenant["id"], id: Scraper["id"]): Promise<ScraperJob[]>

    triggerScraper(tenantID: Tenant["id"], scraperID: Scraper["id"]): Promise<ScraperJob>

    setLastSuccessfulScrapedDate(tenantID: Tenant["id"], scraperID: Scraper["id"], date: DateTime): Promise<DateTime>

    fetchScraperJobLogs(tenantID: string, scraperJobID: string, page: number, pageSize: number): Promise<string[]>
}

export class NoOpDataLayer implements DataLayer {
    createAccount(_args: MutationCreateAccountArgs): Promise<Account> {
        throw new Error("Not implemented")
    }

    createCurrencyRate(_args: MutationCreateCurrencyRateArgs): Promise<CurrencyRate> {
        throw new Error("Not implemented")
    }

    upsertScraper(_args: MutationUpsertScraperArgs): Promise<Scraper> {
        throw new Error("Not implemented")
    }

    createTenant(_args: MutationCreateTenantArgs): Promise<Tenant> {
        throw new Error("Not implemented")
    }

    createTransaction(_args: MutationCreateTransactionArgs): Promise<Transaction> {
        throw new Error("Not implemented")
    }

    deleteAccount(_args: MutationDeleteAccountArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    deleteScraper(_args: MutationDeleteScraperArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    deleteTenant(_args: MutationDeleteTenantArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    deleteTransaction(_args: MutationDeleteTransactionArgs): Promise<void> {
        throw new Error("Not implemented")
    }

    fetchAccount(_tenantID: Tenant["id"], _accountID: Account["id"]): Promise<Account | null> {
        throw new Error("Not implemented")
    }

    fetchAccountBalance(_tenantID: Tenant["id"],
        _accountID: Account["id"],
        _args: AccountBalanceArgs): Promise<number> {
        throw new Error("Not implemented")
    }

    fetchAccountBalanceOverTime(_tenantID: Tenant["id"],
        _accountID: Account["id"],
        _args: AccountBalanceOverTimeArgs): Promise<BalancePoint[]> {
        throw new Error("Not implemented")
    }

    fetchAccountChildren(_tenantID: Tenant["id"], _accountID: Account["id"]): Promise<Account[]> {
        throw new Error("Not implemented")
    }

    fetchAccounts(_tenantID: Tenant["id"], _filter?: string | null): Promise<Account[]> {
        throw new Error("Not implemented")
    }

    fetchAccountsBalanceOverTime(_tenantID: Tenant["id"],
        _args: TenantAccountsBalanceOverTimeArgs): Promise<AccountBalanceOverTime[]> {
        throw new Error("Not implemented")
    }

    fetchCurrency(_code: Currency["code"]): Promise<Currency | null> {
        throw new Error("Not implemented")
    }

    fetchCurrencies(): Promise<Currency[]> {
        throw new Error("Not implemented")
    }

    fetchCurrencyRate(_date: CurrencyRate["date"],
        _sourceCurrencyCode: Currency["code"],
        _targetCurrencyCode: Currency["code"]): Promise<CurrencyRate | null> {
        throw new Error("Not implemented")
    }

    fetchCurrencyRates(_startDate?: CurrencyRate["date"],
        _endDate?: CurrencyRate["date"],
        _sourceCurrencyCode?: Currency["code"],
        _targetCurrencyCode?: Currency["code"]): Promise<CurrencyRate[]> {
        throw new Error("Not implemented")
    }

    fetchRootAccounts(_tenantID: Tenant["id"]): Promise<Account[]> {
        throw new Error("Not implemented")
    }

    fetchScraperType(_scraperTypeID: ScraperType["id"]): Promise<ScraperType | null> {
        throw new Error("Not implemented")
    }

    fetchScraperTypes(): Promise<ScraperType[]> {
        throw new Error("Not implemented")
    }

    fetchScraper(_tenantID: Tenant["id"], _id: Scraper["id"]): Promise<Scraper | null> {
        throw new Error("Not implemented")
    }

    fetchScrapers(_tenantID: Tenant["id"]): Promise<Scraper[]> {
        throw new Error("Not implemented")
    }

    fetchTenants(_args: QueryTenantsArgs): Promise<Tenant[]> {
        throw new Error("Not implemented")
    }

    fetchTenant(_id: Tenant["id"]): Promise<Tenant | null> {
        throw new Error("Not implemented")
    }

    fetchTransaction(_tenantID: Tenant["id"], _txID: Transaction["id"]): Promise<Transaction | null> {
        throw new Error("Not implemented")
    }

    fetchTransactions(_tenantID: Tenant["id"], _direction: TransactionsKey["direction"], _args: TenantTransactionsArgs): Promise<TransactionsResult> {
        throw new Error("Not implemented")
    }

    fetchTransactionsSummary(_tenantID: Tenant["id"]): Promise<TransactionsSummaryResult> {
        throw new Error("Not implemented")
    }

    moveAccount(_args: MutationMoveAccountArgs): Promise<Account> {
        throw new Error("Not implemented")
    }

    fetchScraperJob(_tenantID: Tenant["id"], _id: ScraperJob["id"]): Promise<ScraperJob | null> {
        throw new Error("Not implemented")
    }

    fetchScraperJobs(_tenantID: Tenant["id"], _id: Scraper["id"]): Promise<ScraperJob[]> {
        throw new Error("Not implemented")
    }

    triggerScraper(_tenantID: Tenant["id"], _scraperID: Scraper["id"]): Promise<ScraperJob> {
        throw new Error("Not implemented")
    }

    setLastSuccessfulScrapedDate(_tenantID: Tenant["id"],
        _scraperID: Scraper["id"],
        _date: DateTime): Promise<DateTime> {
        throw new Error("Not implemented")
    }

    fetchScraperJobLogs(_tenantID: string, _scraperJobID: string, _page: number, _pageSize: number): Promise<string[]> {
        throw new Error("Not implemented")
    }
}

export class DataLayerImpl implements DataLayer {
    private readonly currency: DataLoader<Currency["code"], Currency | null>
    private readonly currencyRate: DataLoader<CurrencyRateKey, CurrencyRate | null>
    private readonly scraperType: DataLoader<ScraperType["id"], ScraperType | null>
    private readonly scraper: DataLoader<ScraperKey, Scraper | null>
    private readonly tenant: DataLoader<Tenant["id"], Tenant | null>
    private readonly account: DataLoader<AccountKey, Account | null>

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

        this.scraper = new DataLoader<ScraperKey, Scraper | null>(
            async (keys: readonly ScraperKey[]): Promise<(Scraper | null)[]> => {
                const rowsPerKey = new Map<ScraperKey, Scraper | null>()
                for (const k of keys) {
                    rowsPerKey.set(k, await this.scrapersDAO.fetchScraper(k.tenantID, k.id))
                }
                return keys.map(k => rowsPerKey.get(k) || null)
            },
            { name: "scraper" },
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

    async upsertScraper(args: MutationUpsertScraperArgs): Promise<Scraper> {
        const row = await this.scrapersDAO.upsertScraper(args)
        this.scraper.prime({ tenantID: args.tenantID, id: row.id }, row)
        return row
    }

    async createTenant(args: MutationCreateTenantArgs): Promise<Tenant> {
        const row = await this.tenantsDAO.createTenant(this.accountsDAO, args)
        this.tenant.prime(row.id, row)
        return row
    }

    async createTransaction(args: MutationCreateTransactionArgs): Promise<Transaction> {
        return await this.transactionsDAO.createTransaction(args.tx)
    }

    async deleteAccount(args: MutationDeleteAccountArgs): Promise<void> {
        await this.accountsDAO.deleteAccount(args.tenantID, args.id)
        this.account.clear({ tenantID: args.tenantID, accountID: args.id })
    }

    async deleteScraper(args: MutationDeleteScraperArgs): Promise<void> {
        const row = await this.scrapersDAO.deleteScraper(args)
        this.scraper.clear({ tenantID: args.tenantID, id: args.id })
        return row
    }

    async deleteTenant(args: MutationDeleteTenantArgs): Promise<void> {
        const scrapers = await this.scrapersDAO.fetchScrapers(args.id)
        for (let scraper of scrapers) {
            await this.scrapersDAO.deleteScraper({ tenantID: args.id, id: scraper.id })
        }

        const row = await this.tenantsDAO.deleteTenant(args)
        this.tenant.clear(args.id)
        this.account.clearAll()
        return row
    }

    async deleteTransaction(args: MutationDeleteTransactionArgs): Promise<void> {
        return await this.transactionsDAO.deleteTransaction(args.tenantID, args.id)
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
        const accounts = await this.accountsDAO.fetchChildAccounts(tenantID, accountID)
        accounts.forEach(a => this.account.prime({ tenantID, accountID: a.id }, a))
        return accounts
    }

    async fetchAccounts(tenantID: Tenant["id"], filter?: string | null): Promise<Account[]> {
        const accounts = await this.accountsDAO.fetchAccounts(tenantID, filter)
        accounts.forEach(a => this.account.prime({ tenantID, accountID: a.id }, a))
        return accounts
    }

    async fetchAccountsBalanceOverTime(
        tenantID: Tenant["id"],
        args: TenantAccountsBalanceOverTimeArgs,
    ): Promise<AccountBalanceOverTime[]> {
        const txSummary = await this.fetchTransactionsSummary(tenantID)
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
        const rootAccounts = await this.accountsDAO.fetchRootAccounts(tenantID)
        rootAccounts.forEach(a => this.account.prime({ tenantID, accountID: a.id }, a))
        return rootAccounts
    }

    async fetchScraperType(scraperTypeID: ScraperType["id"]): Promise<ScraperType | null> {
        return this.scraperType.load(scraperTypeID)
    }

    async fetchScraperTypes(): Promise<ScraperType[]> {
        const scraperTypes = await this.scrapersDAO.fetchScraperTypes()
        scraperTypes.forEach(st => this.scraperType.prime(st.id, st))
        return scraperTypes
    }

    async fetchScraper(tenantID: Tenant["id"], id: Scraper["id"]): Promise<Scraper | null> {
        return this.scraper.load({ tenantID, id })
    }

    async fetchScrapers(tenantID: Tenant["id"], scraperTypeID?: ScraperType["id"]): Promise<Scraper[]> {
        const scrapers = await this.scrapersDAO.fetchScrapers(tenantID, scraperTypeID)
        scrapers.forEach(s => this.scraper.prime({ tenantID, id: s.id }, s))
        return scrapers
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
        return await this.transactionsDAO.fetchTransaction(tenantID, txID)
    }

    async fetchTransactions(
        tenantID: Tenant["id"],
        direction: TransactionsKey["direction"],
        args: TenantTransactionsArgs,
    ): Promise<TransactionsResult> {
        return await this.transactionsDAO.fetchTransactions(tenantID, direction, args)
    }

    async fetchTransactionsSummary(tenantID: Tenant["id"]): Promise<TransactionsSummaryResult> {
        return await this.transactionsDAO.fetchTransactionsSummary(tenantID)
    }

    async moveAccount(args: MutationMoveAccountArgs): Promise<Account> {
        const row = await this.accountsDAO.moveAccount(
            args.tenantID,
            args.accountID,
            args.targetParentAccountID || null,
        )
        this.account.prime({ tenantID: args.tenantID, accountID: row.id }, row)
        return row
    }

    async fetchScraperJob(tenantID: Tenant["id"], id: ScraperJob["id"]): Promise<ScraperJob | null> {
        return await this.scrapersDAO.fetchScraperJob(tenantID, id)
    }

    async fetchScraperJobs(tenantID: Tenant["id"], id: Scraper["id"]): Promise<ScraperJob[]> {
        return await this.scrapersDAO.fetchScraperJobs(tenantID, id)
    }

    async triggerScraper(tenantID: Tenant["id"], scraperID: Scraper["id"]): Promise<ScraperJob> {
        return await this.scrapersDAO.triggerScraper(tenantID, scraperID)
    }

    async setLastSuccessfulScrapedDate(
        tenantID: Tenant["id"],
        scraperID: Scraper["id"],
        date: DateTime): Promise<DateTime> {
        return await this.scrapersDAO.setLastSuccessfulScrapedDate(tenantID, scraperID, date)
    }

    async fetchScraperJobLogs(
        tenantID: string,
        scraperJobID: string,
        page: number,
        pageSize: number): Promise<string[]> {
        return await this.scrapersDAO.fetchScraperJobLogs(tenantID, scraperJobID, page, pageSize)
    }
}

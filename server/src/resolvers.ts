import { Context } from "./context.js"
import {
    Account,
    Currency,
    CurrencyRate,
    Resolvers,
    Scraper,
    ScraperType,
    Tenant,
    Transaction,
    TransactionClassification,
} from "./schema/graphql.js"
import { DateTimeScalar } from "./schema/scalars-luxon-datetime.js"
import { VoidScalar } from "./schema/scalars-void.js"

import { TransactionsSummaryResult } from "./data/transactions.js"
import pkg from "../package.json" with { type: "json" }
import { required } from "./util/util.js"
import { classifyTransaction } from "./classify/classify-transactions.js"

export interface AccountRow extends Account {
    tenantID: Tenant["id"],
    parentID: Account["id"],
}

export interface ScraperRow extends Scraper {
    tenantID: Tenant["id"],
    scraperTypeID: ScraperType["id"],
}

export interface TransactionRow extends Transaction {
    tenantID: Tenant["id"],
}

export const GraphResolvers: Resolvers<Context> = {
    Mutation: {
        noOp: async (_: any, _args, _ctx) => {
        },
        createAccount: async (_: any, args, ctx) => ctx.data.createAccount(args),
        createCurrencyRate: async (_: any, args, ctx) => ctx.data.createCurrencyRate(args),
        upsertScraper: async (_: any, args, ctx) => ctx.data.upsertScraper(args),
        createTransaction: async (_: any, args, ctx) => ctx.data.createTransaction(args),
        createTenant: async (_: any, args, ctx) => ctx.data.createTenant(args),
        deleteAccount: async (_: any, args, ctx) => ctx.data.deleteAccount(args),
        deleteScraper: async (_: any, args, ctx) => ctx.data.deleteScraper(args),
        deleteTenant: async (_: any, args, ctx) => ctx.data.deleteTenant(args),
        deleteTransaction: async (_: any, args, ctx) => ctx.data.deleteTransaction(args),
        moveAccount: async (_: any, args, ctx) => ctx.data.moveAccount(args),
        setLastSuccessfulScrapedDate: async (_: any, args, ctx) =>
            ctx.data.setLastSuccessfulScrapedDate(args.tenantID, args.scraperID, args.date),
        triggerScraper: async (_: any, args, ctx) =>
            ctx.data.triggerScraper(args.tenantID, args.id),
    },
    Query: {
        version: async (_: any, _args, _ctx) => pkg.version,
        tenants: async (_: any, args, ctx) => ctx.data.fetchTenants(args),
        tenant: async (_: any, args, ctx) => ctx.data.fetchTenant(args.id),
        currencies: async (_parent, _args: any, ctx): Promise<Currency[]> => ctx.data.fetchCurrencies(),
        currency: async (_parent, args, ctx) => ctx.data.fetchCurrency(args.code),
        currencyRate: async (_parent, args, ctx) => ctx.data.fetchCurrencyRate(
            args.date,
            args.sourceCurrencyCode,
            args.targetCurrencyCode,
        ),
        currencyRates: async (_parent, args, ctx): Promise<CurrencyRate[]> =>
            ctx.data.fetchCurrencyRates(
                args.startDate || undefined,
                args.endDate || undefined,
                args.sourceCurrencyCode || undefined,
                args.targetCurrencyCode || undefined,
            ),
        scraperTypes: async (_parent, _args, ctx) =>
            ctx.data.fetchScraperTypes(),
    },
    Scraper: {
        job: async (scraper, args, ctx) =>
            ctx.data.fetchScraperJob(scraper.tenant.id, args.id),
        jobs: async (scraper, _args: any, ctx) =>
            ctx.data.fetchScraperJobs((scraper as ScraperRow).tenantID, scraper.id),
    },
    ScraperJob: {
        logs: async (job, args, ctx) =>
            ctx.data.fetchScraperJobLogs(job.scraper.tenant.id, job.id, args.page || 0, args.pageSize || 100),
    },
    Tenant: {
        rootAccounts: async (tenant, _: any, ctx): Promise<Account[]> => ctx.data.fetchRootAccounts(tenant.id),
        account: async (tenant, args, ctx) => ctx.data.fetchAccount(tenant.id, args.id),
        accounts: async (tenant, args, ctx) => ctx.data.fetchAccounts(tenant.id, args.filter),
        accountsBalanceOverTime: async (tenant, args, ctx) =>
            ctx.data.fetchAccountsBalanceOverTime(tenant.id, args),
        transactions: async (tenant, args, ctx) =>
            ctx.data.fetchTransactions(tenant.id, "all", args),
        firstTransactionDate: async (tenant, _args, ctx) => {
            const summary: TransactionsSummaryResult = await ctx.data.fetchTransactionsSummary(tenant.id)
            return summary.firstTransactionDate || null
        },
        lastTransactionDate: async (tenant, _args, ctx) => {
            const summary = await ctx.data.fetchTransactionsSummary(tenant.id)
            return summary.lastTransactionDate || null
        },
        totalTransactions: async (tenant, _args, ctx) => {
            const summary = await ctx.data.fetchTransactionsSummary(tenant.id)
            return summary.totalCount
        },
        scrapers: async (tenant, args, ctx) => ctx.data.fetchScrapers(tenant.id, args.scraperTypeID || undefined),
        scraper: async (tenant, args, ctx) => ctx.data.fetchScraper(tenant.id, args.id),
        transaction: async (tenant, args, ctx): Promise<Transaction | null> => ctx.data.fetchTransaction(tenant.id,
            args.id),
    },
    Account: {
        parent: async (account, _args: any, ctx) => ctx.data.fetchAccount(
            (account as AccountRow).tenantID,
            (account as AccountRow).parentID,
        ),
        children: async (account, _: any, ctx) =>
            ctx.data.fetchAccountChildren((account as AccountRow).tenantID, account.id),
        tenant: async (account, _: any, ctx) => required(
            await ctx.data.fetchTenant((account as AccountRow).tenantID),
            "Tenant not found",
        ),
        incomingTransactions: async (account, args, ctx) =>
            ctx.data.fetchTransactions(
                (account as AccountRow).tenantID,
                "incoming",
                { ...args, involvingAccountID: account.id },
            ),
        outgoingTransactions: async (account, args, ctx) =>
            ctx.data.fetchTransactions(
                (account as AccountRow).tenantID,
                "outgoing",
                { ...args, involvingAccountID: account.id },
            ),
        transactions: async (account, args, ctx) =>
            ctx.data.fetchTransactions(
                (account as AccountRow).tenantID,
                "all",
                { ...args, involvingAccountID: account.id },
            ),
        balance: async (account, args, ctx) =>
            ctx.data.fetchAccountBalance((account as AccountRow).tenantID, account.id, args),
        balanceOverTime: async (account, args, ctx) =>
            ctx.data.fetchAccountBalanceOverTime(
                (account as AccountRow).tenantID,
                account.id,
                args,
            ),
    },
    Transaction: {
        classification: async (tx, _args, ctx): Promise<TransactionClassification> => {
            const txRow                                         = tx as TransactionRow
            const accounts                                      = await ctx.data.fetchAccounts(txRow.tenantID)
            const accountsByID: { [p: Account["id"]]: Account } = accounts.reduce(
                (prev, a) => ({ ...prev, [a.id]: a }),
                {},
            )

            const c = await classifyTransaction(tx, accounts)
            if (!c?.sourceAccountID) {
                throw new Error("Transaction classification failed: missing source account ID")
            } else if (!c.targetAccountID) {
                throw new Error("Transaction classification failed: missing target account ID")
            } else if (!accountsByID[c.sourceAccountID]) {
                throw new Error("Transaction classification failed: source account not found")
            } else if (!accountsByID[c.targetAccountID]) {
                throw new Error("Transaction classification failed: target account not found")
            } else if (!c.confidence) {
                throw new Error("Transaction classification failed: missing confidence")
            } else if (!c.reasoning) {
                throw new Error("Transaction classification failed: missing reasoning")
            }
            return {
                sourceAccount: accountsByID[c.sourceAccountID],
                targetAccount: accountsByID[c.targetAccountID],
                confidence: c.confidence,
                reasoning: c.reasoning,
            }
        },
    },
    DateTime: DateTimeScalar,
    Void: VoidScalar,
}

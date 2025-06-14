import {
    Account,
    CreateTransaction,
    SortDirection,
    Tenant,
    TenantTransactionsArgs,
    Transaction,
    TransactionsResult,
    TransactionsSortColumns,
    TransactionsSortColumnsInput,
} from "../schema/graphql.js"
import { PoolClient } from "pg"
import { convertObjectKeysToCamelCase } from "./pg_client.js"

export interface TransactionsSummaryResult {
    firstTransactionDate: Tenant["firstTransactionDate"] | null,
    lastTransactionDate: Tenant["lastTransactionDate"] | null,
    totalCount: Tenant["totalTransactions"],
}

type TransactionSortColumnMapping = {
    [key in TransactionsSortColumns]: string
}

export class TransactionsDataAccessLayer {
    private readonly defaultTransactionsPageSize                              = 20
    private readonly transactionSortColumnNames: TransactionSortColumnMapping = {
        [TransactionsSortColumns.Id]: "t.id",
        [TransactionsSortColumns.Amount]: "t.amount",
        [TransactionsSortColumns.CreatedAt]: "t.created_at",
        [TransactionsSortColumns.Date]: "t.date",
        [TransactionsSortColumns.Description]: "t.description",
        [TransactionsSortColumns.ReferenceId]: "t.reference_id",
        [TransactionsSortColumns.SourceAccountName]: "sa.display_name",
        [TransactionsSortColumns.TargetAccountName]: "ta.display_name",
        [TransactionsSortColumns.UpdatedAt]: "t.updated_at",
    }

    constructor(private readonly pg: PoolClient) {
    }

    async createTransaction(tx: CreateTransaction): Promise<Transaction> {
        const res = await this.pg.query(`
            INSERT INTO transactions (date, sequence, reference_id, amount, currency, description, source_account_id,
                                      target_account_id, tenant_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT ON CONSTRAINT uq_transactions DO UPDATE SET sequence = excluded.sequence
            RETURNING transactions.id AS id
        `, [
            tx.date.toJSDate(),
            tx.sequence,
            tx.referenceID || "",
            tx.amount,
            tx.currency,
            tx.description,
            tx.sourceAccountID || "unknown",
            tx.targetAccountID || "unknown",
            tx.tenantID,
        ])
        if (res.rowCount != 1 || res.rows.length != 1) {
            throw new Error(`Incorrect number of rows affected or returned: ${JSON.stringify(res)}`)
        }
        return (await this.fetchTransaction(tx.tenantID, res.rows[0].id))!
    }

    async deleteTransaction(tenantID: Tenant["id"], id: Account["id"]): Promise<void> {
        const res = await this.pg.query(`
                    DELETE
                    FROM transactions
                    WHERE tenant_id = $1 AND id = $2
            `,
            [ tenantID, id ])
        if (res.rowCount != 1) {
            throw new Error(`Incorrect number of rows affected: ${JSON.stringify(res)}`)
        }
    }

    async fetchTransaction(tenantID: Tenant["id"], txID: Transaction["id"]): Promise<Transaction | null> {
        const res = await this.pg.query(`
                    SELECT t.id,
                           t.created_at,
                           t.updated_at,
                           t.date,
                           t.sequence,
                           t.reference_id,
                           t.amount,
                           t.currency,
                           t.description,
                           t.source_account_id,
                           t.target_account_id,
                           t.tenant_id,
                           c.code                                           AS currency_code,
                           c.created_at                                     AS currency_created_at,
                           c.updated_at                                     AS currency_updated_at,
                           c.country_codes                                  AS currency_countries,
                           c.decimal_digits                                 AS currency_decimal_digits,
                           c.name                                           AS currency_name,
                           c.name_plural                                    AS currency_name_plural,
                           c.native_symbol                                  AS currency_native_symbol,
                           c.symbol                                         AS currency_symbol,
                           sa.id                                            AS sa_id,
                           sa.created_at                                    AS sa_created_at,
                           sa.updated_at                                    AS sa_updated_at,
                           sa.display_name                                  AS sa_display_name,
                           sa.icon                                          AS sa_icon,
                           sa.type                                          AS sa_type,
                           sa.parent_id                                     AS sa_parent_id,
                           (SELECT COALESCE(COUNT(a.id), 0)
                            FROM accounts AS a
                            WHERE a.tenant_id = $1 AND a.parent_id = sa.id) AS sa_child_count,
                           ta.id                                            AS ta_id,
                           ta.created_at                                    AS ta_created_at,
                           ta.updated_at                                    AS ta_updated_at,
                           ta.display_name                                  AS ta_display_name,
                           ta.icon                                          AS ta_icon,
                           ta.type                                          AS ta_type,
                           ta.parent_id                                     AS ta_parent_id,
                           (SELECT COALESCE(COUNT(a.id), 0)
                            FROM accounts AS a
                            WHERE a.tenant_id = $1 AND a.parent_id = ta.id) AS ta_child_count
                    FROM transactions t
                             JOIN currencies c ON t.currency = c.code
                             JOIN accounts sa ON t.tenant_id = sa.tenant_id AND t.source_account_id = sa.id
                             JOIN accounts ta ON t.tenant_id = ta.tenant_id AND t.target_account_id = ta.id
                    WHERE t.tenant_id = $1 AND t.id = $2
            `,
            [ tenantID, txID ])
        if (res.rows.length == 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows.map(convertObjectKeysToCamelCase).map(this.convertTransactionRow)[0] as Transaction
        }
    }

    async fetchTransactions(
        tenantID: Tenant["id"],
        direction: "incoming" | "outgoing" | "all" | undefined,
        args: TenantTransactionsArgs,
    ): Promise<TransactionsResult> {

        const cte           = `
            WITH RECURSIVE accounts_tree AS (SELECT tenant_id, id, parent_id
                                             FROM accounts
                                             WHERE tenant_id = $1 AND id = $2
                                             UNION ALL
                                             SELECT a.tenant_id, a.id, a.parent_id
                                             FROM accounts a
                                                      INNER JOIN accounts_tree AS wsa
                                                                 ON a.tenant_id = wsa.tenant_id AND a.parent_id = wsa.id
                                             WHERE a.tenant_id = $1)
        `
        const cteJoins      = `
        LEFT JOIN accounts_tree source_tree ON t.tenant_id = source_tree.tenant_id AND t.source_account_id = source_tree.id
        LEFT JOIN accounts_tree target_tree ON t.tenant_id = target_tree.tenant_id AND t.target_account_id = target_tree.id
    `
        const directionCond = args.involvingAccountID
            ? (direction === "incoming"
                ? "target_tree.id IS NOT NULL"
                : direction === "outgoing"
                    ? "source_tree.id IS NOT NULL"
                    : "(target_tree.id IS NOT NULL OR source_tree.id IS NOT NULL)")
            : "TRUE"

        const parameters: any[] = [ tenantID ]

        if (args.involvingAccountID) {
            parameters.push(args.involvingAccountID)
        }

        let sinceIndex
        if (args.since) {
            parameters.push(args.since.toISO({ includeOffset: false }))
            sinceIndex = parameters.length
        }

        let untilIndex
        if (args.until) {
            parameters.push(args.until.toISO({ includeOffset: false }))
            untilIndex = parameters.length
        }

        const rowsRes = await this.pg.query(`
                    ${args.involvingAccountID ? cte : ``}
                    SELECT t.id,
                           t.created_at,
                           t.updated_at,
                           t.date,
                           t.sequence,
                           t.reference_id,
                           t.amount,
                           t.currency,
                           t.description,
                           t.source_account_id,
                           t.target_account_id,
                           t.tenant_id,
                           c.code           AS currency_code,
                           c.created_at     AS currency_created_at,
                           c.updated_at     AS currency_updated_at,
                           c.country_codes  AS currency_countries,
                           c.decimal_digits AS currency_decimal_digits,
                           c.name           AS currency_name,
                           c.name_plural    AS currency_name_plural,
                           c.native_symbol  AS currency_native_symbol,
                           c.symbol         AS currency_symbol,
                           sa.id            AS sa_id,
                           sa.created_at    AS sa_created_at,
                           sa.updated_at    AS sa_updated_at,
                           sa.display_name  AS sa_display_name,
                           sa.icon          AS sa_icon,
                           sa.type          AS sa_type,
                           sa.parent_id     AS sa_parent_id,
                           sa.child_count   AS sa_child_count,
                           ta.id            AS ta_id,
                           ta.created_at    AS ta_created_at,
                           ta.updated_at    AS ta_updated_at,
                           ta.display_name  AS ta_display_name,
                           ta.icon          AS ta_icon,
                           ta.type          AS ta_type,
                           ta.parent_id     AS ta_parent_id,
                           ta.child_count   AS ta_child_count
                    FROM transactions t
                             JOIN currencies AS c ON t.currency = c.code
                             JOIN v_accounts AS sa ON t.tenant_id = sa.tenant_id AND t.source_account_id = sa.id
                             JOIN v_accounts AS ta ON t.tenant_id = ta.tenant_id AND t.target_account_id = ta.id
                        ${args.involvingAccountID ? cteJoins : ``}
                    WHERE t.tenant_id = $1
                      AND ${directionCond}
                      AND ${args.since ? `t.date >= $${sinceIndex}` : `TRUE`}
                      AND ${args.until ? `t.date <= $${untilIndex}` : `TRUE`}
                    ORDER BY ${this.buildTransactionSorting(args.sort).join(", ")}
                    LIMIT ${args.limit || this.defaultTransactionsPageSize} OFFSET ${args.offset || 0}
            `,
            parameters)
        const rows    = rowsRes.rows.map(convertObjectKeysToCamelCase).map(this.convertTransactionRow)

        const metadataRes = await this.pg.query(`
            ${args.involvingAccountID ? cte : ``}
            SELECT COUNT(t.id) AS total_count
            FROM transactions t
                     JOIN currencies c ON t.currency = c.code
                     JOIN v_accounts AS sa ON t.tenant_id = sa.tenant_id AND t.source_account_id = sa.id
                     JOIN v_accounts AS ta ON t.tenant_id = ta.tenant_id AND t.target_account_id = ta.id
                ${args.involvingAccountID ? cteJoins : ``}
            WHERE t.tenant_id = $1
              AND ${directionCond}
              AND ${args.since ? `t.date >= $${sinceIndex}` : `TRUE`}
              AND ${args.until ? `t.date <= $${untilIndex}` : `TRUE`}
        `, parameters)
        if (metadataRes.rows.length != 1) {
            throw new Error(`Expected exactly one metadata row, got ${metadataRes.rows.length}`)
        }

        return { rows, totalCount: metadataRes.rows[0].total_count as number }
    }

    async fetchTransactionsSummary(tenantID: Tenant["id"]): Promise<TransactionsSummaryResult> {
        const res = await this.pg.query(`
            SELECT MIN(t.date) AS first_transaction_date,
                   MAX(t.date) AS last_transaction_date,
                   COUNT(t.id) AS total_count
            FROM transactions t
                     JOIN currencies c ON t.currency = c.code
                     JOIN accounts sa ON t.tenant_id = sa.tenant_id AND t.source_account_id = sa.id
                     JOIN accounts ta ON t.tenant_id = ta.tenant_id AND t.target_account_id = ta.id
            WHERE t.tenant_id = $1
        `, [ tenantID ])
        if (res.rows.length != 1) {
            throw new Error(`Expected exactly one row, got ${res.rows.length}`)
        }
        return res.rows.map(convertObjectKeysToCamelCase)[0] as TransactionsSummaryResult
    }

    private convertTransactionRow(r: any): Transaction {
        return {
            ...r,
            currency: {
                code: r.currencyCode,
                createdAt: r.currencyCreatedAt,
                updatedAt: r.currencyUpdatedAt,
                countries: r.currencyCountries,
                decimalDigits: r.currencyDecimalDigits,
                name: r.currencyName,
                namePlural: r.currencyNamePlural,
                nativeSymbol: r.currencyNativeSymbol,
                symbol: r.currencySymbol,
            },
            sourceAccount: {
                tenantID: r.tenantID,
                id: r.saID,
                createdAt: r.saCreatedAt,
                updatedAt: r.saUpdatedAt,
                displayName: r.saDisplayName,
                icon: r.saIcon,
                type: r.saType,
                parentID: r.saParentID,
                childCount: r.saChildCount,
            },
            targetAccount: {
                tenantID: r.tenantID,
                id: r.taID,
                createdAt: r.taCreatedAt,
                updatedAt: r.taUpdatedAt,
                displayName: r.taDisplayName,
                icon: r.taIcon,
                type: r.taType,
                parentID: r.taParentID,
                childCount: r.taChildCount,
            },
        }
    }

    private buildTransactionSorting(sort?: TransactionsSortColumnsInput[] | null): string[] {
        let sortCols: string[] = []
        if (sort && sort.length > 0) {
            for (let c of sort) {
                sortCols.push(`${this.transactionSortColumnNames[c.col]} ${c.direction}`)
            }
        }
        if (sortCols.length === 0) {
            sortCols.push(`${this.transactionSortColumnNames[TransactionsSortColumns.Date]} ${SortDirection.Desc}`)
        }
        sortCols.push(`${this.transactionSortColumnNames[TransactionsSortColumns.Id]} ${SortDirection.Asc}`)
        return sortCols
    }
}
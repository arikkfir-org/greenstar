import { PoolClient } from "pg"
import {
    Account,
    AccountBalanceArgs,
    AccountBalanceOverTime,
    AccountBalanceOverTimeArgs,
    AccountType,
    BalancePoint,
    MutationCreateAccountArgs,
    Tenant,
} from "../schema/graphql.js"
import { convertObjectKeysToCamelCase } from "./pg_client.js"
import { DateTime } from "luxon"

export class AccountsDataAccessLayer {
    constructor(private readonly pg: PoolClient) {
    }

    async createAccount(args: MutationCreateAccountArgs): Promise<Account> {
        const { id, displayName, icon, type, parentID, tenantID } = args
        if (type) {
            switch (type) {
                case AccountType.CheckingAccount:
                    break
                default:
                    throw new Error(`Account type ${type} not supported`)
            }
        }
        const res = await this.pg.query(`
                    INSERT INTO accounts (id, display_name, icon, parent_id, tenant_id)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id
            `,
            [ id, displayName, icon || "<svg></svg>", parentID, tenantID ])
        if (res.rowCount != 1 || res.rows.length != 1) {
            throw new Error(`Incorrect number of rows affected or returned: ${JSON.stringify(res)}`)
        }
        return (await this.fetchAccount(tenantID, res.rows[0].id))!
    }

    async deleteAccount(tenantID: Tenant["id"], id: Account["id"]): Promise<void> {
        const res = await this.pg.query(`
                    DELETE
                    FROM accounts
                    WHERE tenant_id = $1 AND id = $2
            `,
            [ tenantID, id ])
        if (res.rowCount != 1) {
            throw new Error(`Incorrect number of rows affected: ${JSON.stringify(res)}`)
        }
    }

    async fetchAccount(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account | null> {
        const res = await this.pg.query(`
                    SELECT tenant_id,
                           id,
                           created_at,
                           updated_at,
                           display_name,
                           icon,
                           type,
                           parent_id,
                           child_count
                    FROM v_accounts
                    WHERE tenant_id = $1 AND id = $2
            `,
            [ tenantID, accountID ])
        if (res.rows.length == 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows.map(convertObjectKeysToCamelCase)[0] as Account
        }
    }

    async fetchAccountBalance(tenantID: Tenant["id"],
        accountID: Account["id"],
        args: AccountBalanceArgs): Promise<number> {

        const parameters: any[] = [
            tenantID,
            accountID,
            args.currency,
        ]
        if (args.until) {
            parameters.push(args.until.toISO({ includeOffset: true }))
        }

        const sql = `
            WITH RECURSIVE
                accounts_tree AS (SELECT tenant_id, id
                                  FROM accounts
                                  WHERE tenant_id = $1 AND id = $2
                                  UNION ALL
                                  SELECT a.tenant_id, a.id
                                  FROM accounts a
                                           INNER JOIN accounts_tree AS at
                                                      ON a.tenant_id = at.tenant_id AND a.parent_id = at.id
                                  WHERE a.tenant_id = $1),
                incoming AS (SELECT COALESCE(SUM(t.amount * COALESCE(r.rate, 1)), 0) AS total
                             FROM transactions t
                                      JOIN accounts_tree AS at
                                           ON at.tenant_id = t.tenant_id AND t.target_account_id = at.id
                                      LEFT JOIN rates AS r
                                                ON r.source_currency_code = t.currency
                                                    AND r.target_currency_code = $3
                                                    AND r.date = date(t.date)
                             WHERE t.tenant_id = $1 AND ${args.until ? `t.date <= $4` : `TRUE`}),
                outgoing AS (SELECT COALESCE(SUM(t.amount * COALESCE(r.rate, 1)), 0) AS total
                             FROM transactions t
                                      JOIN accounts_tree AS at
                                           ON t.tenant_id = at.tenant_id AND t.source_account_id = at.id
                                      LEFT JOIN rates AS r
                                                ON r.source_currency_code = t.currency
                                                    AND r.target_currency_code = $3
                                                    AND r.date = date(t.date)
                             WHERE t.tenant_id = $1 AND ${args.until ? `t.date <= $4` : `TRUE`})
            SELECT (SELECT total FROM incoming) - (SELECT total FROM outgoing) AS balance
        `

        const res = await this.pg.query(sql, parameters)

        if (!res.rows.length) {
            throw new Error(`Account with ID ${accountID} not found in tenant ${tenantID}`)
        } else if (res.rows.length > 1) {
            throw new Error(`Multiple accounts with the same ID: ${accountID} in tenant ${tenantID}`)
        } else {
            return res.rows[0].balance || 0
        }
    }

    async fetchAccountBalanceOverTime(tenantID: Tenant["id"],
        accountID: Account["id"],
        args: AccountBalanceOverTimeArgs): Promise<BalancePoint[]> {

        // Generate dates between startDate and endDate
        const dates: DateTime[] = []
        let currentDate         = args.startDate
        while (currentDate <= args.endDate) {
            dates.push(currentDate)
            currentDate = currentDate.plus({ days: 1 })
        }

        // Calculate balances for all dates in a single query
        const res = await this.pg.query(`
                    WITH RECURSIVE
                        accounts_tree AS (SELECT tenant_id, id
                                          FROM accounts
                                          WHERE tenant_id = $1 AND id = $2
                                          UNION ALL
                                          SELECT a.tenant_id, a.id
                                          FROM accounts a
                                                   INNER JOIN accounts_tree AS at
                                                              ON a.tenant_id = at.tenant_id AND a.parent_id = at.id
                                          WHERE a.tenant_id = $1),
                        date_range AS (SELECT date::DATE FROM UNNEST($4::TEXT[]) AS date),
                        transactions_with_rates AS (SELECT t.date,
                                                           t.amount * COALESCE(r.rate, 1) AS converted_amount,
                                                           CASE
                                                               WHEN ta.id IS NOT NULL THEN 1
                                                               WHEN sa.id IS NOT NULL THEN -1
                                                               ELSE 0
                                                               END                        AS direction
                                                    FROM transactions t
                                                             LEFT JOIN accounts_tree AS sa
                                                                       ON t.tenant_id = sa.tenant_id AND t.source_account_id = sa.id
                                                             LEFT JOIN accounts_tree AS ta
                                                                       ON t.tenant_id = ta.tenant_id AND t.target_account_id = ta.id
                                                             LEFT JOIN rates AS r
                                                                       ON r.source_currency_code = t.currency
                                                                           AND r.target_currency_code = $3
                                                                           AND r.date = date(t.date)
                                                    WHERE t.tenant_id = $1
                                                      AND (sa.id IS NOT NULL OR ta.id IS NOT NULL)
                                                      AND t.date <= $5),
                        daily_balances AS (SELECT dr.date,
                                                  SUM(
                                                          CASE
                                                              WHEN twr.date <= dr.date
                                                                  THEN twr.converted_amount * twr.direction
                                                              ELSE 0
                                                              END
                                                  ) AS balance
                                           FROM date_range dr
                                                    LEFT JOIN transactions_with_rates twr ON date(twr.date) <= dr.date
                                           GROUP BY dr.date
                                           ORDER BY dr.date)
                    SELECT db.date AS date, COALESCE(db.balance, 0) AS balance
                    FROM daily_balances AS db
            `,
            [
                tenantID,
                accountID,
                args.currency,
                dates.map(d => d.toISO({ includeOffset: true })!),
                args.endDate.toISO({ includeOffset: true }),
            ])

        // Convert the results to the expected format
        return res.rows
                  .map(row => ({ date: row.date, balance: row.balance || 0 } as BalancePoint))
                  .filter((v, index, arr) => index == 0 || v.balance != arr[index - 1].balance)
    }

    async fetchAccounts(tenantID: Tenant["id"], displayNameFilter?: string | null): Promise<Account[]> {
        const parameters: any[] = [ tenantID ]
        if (displayNameFilter) {
            parameters.push(displayNameFilter)
        }
        const res = await this.pg.query(`
                    SELECT tenant_id,
                           id,
                           created_at,
                           updated_at,
                           display_name,
                           icon,
                           type,
                           parent_id,
                           child_count
                    FROM v_accounts
                    WHERE tenant_id = $1
                        ${displayNameFilter ? `AND p.display_name ILIKE $2` : ``}
                    ORDER BY display_name, id
            `,
            parameters)
        return res.rows.map(convertObjectKeysToCamelCase) as Account[]
    }

    async fetchAccountsBalanceOverTime(
        tenantID: Tenant["id"],
        accountIDs: Account["id"][],
        currency: string,
        startDate: DateTime,
        endDate: DateTime,
    ): Promise<AccountBalanceOverTime[]> {

        const balances: AccountBalanceOverTime[] = []

        // Generate dates between startDate and endDate
        const dates: DateTime[] = []
        let currentDate         = startDate
        while (currentDate <= endDate) {
            dates.push(currentDate)
            currentDate = currentDate.plus({ days: 1 })
        }

        for (const accountID of accountIDs) {
            const parameters: any[] = [
                tenantID,
                accountID,
                currency,
                dates.map(d => d.toISO({ includeOffset: true })!),
                endDate.toISO({ includeOffset: true }),
            ]

            const sql = `
                WITH RECURSIVE
                    accounts_tree AS (SELECT tenant_id, id
                                      FROM accounts
                                      WHERE tenant_id = $1 AND id = $2
                                      UNION ALL
                                      SELECT a.tenant_id, a.id
                                      FROM accounts a
                                               INNER JOIN accounts_tree AS at
                                                          ON a.tenant_id = at.tenant_id AND a.parent_id = at.id
                                      WHERE a.tenant_id = $1),
                    date_range AS (SELECT date::DATE FROM UNNEST($4::TEXT[]) AS date),
                    transactions_with_rates AS (SELECT t.date,
                                                       t.amount * COALESCE(r.rate, 1) AS converted_amount,
                                                       CASE
                                                           WHEN ta.id IS NOT NULL AND sa.id IS NULL THEN 1
                                                           WHEN sa.id IS NOT NULL AND ta.id IS NULL THEN -1
                                                           ELSE 0
                                                           END                        AS direction
                                                FROM transactions t
                                                         LEFT JOIN rates AS r
                                                                   ON r.source_currency_code = t.currency
                                                                       AND r.target_currency_code = $3
                                                                       AND r.date = date(t.date)
                                                         LEFT JOIN accounts_tree AS sa
                                                                   ON t.tenant_id = sa.tenant_id AND t.source_account_id = sa.id
                                                         LEFT JOIN accounts_tree AS ta
                                                                   ON t.tenant_id = ta.tenant_id AND t.target_account_id = ta.id
                                                WHERE t.tenant_id = $1
                                                  AND (ta.id IS NOT NULL OR sa.id IS NOT NULL)
                                                  AND t.date <= $5),
                    daily_balances AS (SELECT dr.date, SUM(tx.converted_amount * tx.direction) AS balance
                                       FROM date_range AS dr
                                                JOIN transactions_with_rates AS tx ON date(tx.date) <= dr.date
                                       GROUP BY dr.date
                                       ORDER BY dr.date)
                SELECT db.date AS date, COALESCE(db.balance, 0) AS balance
                FROM daily_balances AS db
                ORDER BY db.date
            `

            const res = await this.pg.query(sql, parameters)

            const account = (await this.fetchAccount(tenantID, accountID))!
            balances.push({
                account: account,
                points: res.rows
                           .map(row => ({ date: row.date, balance: row.balance || 0 } as BalancePoint))
                           .filter((v, index, arr) => index == 0 || v.balance != arr[index - 1].balance),
            })
        }
        return balances
    }

    async fetchChildAccounts(tenantID: Tenant["id"], accountID: Account["id"]): Promise<Account[]> {
        const res = await this.pg.query(`
                    SELECT tenant_id,
                           id,
                           created_at,
                           updated_at,
                           display_name,
                           icon,
                           type,
                           parent_id,
                           child_count
                    FROM v_accounts
                    WHERE tenant_id = $1 AND parent_id = $2
                    ORDER BY display_name, id
            `,
            [ tenantID, accountID ])
        return res.rows.map(convertObjectKeysToCamelCase) as Account[]
    }

    async fetchRootAccounts(tenantID: Tenant["id"]): Promise<Account[]> {
        const res = await this.pg.query(`
                    SELECT tenant_id,
                           id,
                           created_at,
                           updated_at,
                           display_name,
                           icon,
                           type,
                           parent_id,
                           child_count
                    FROM v_accounts
                    WHERE tenant_id = $1 AND parent_id IS NULL
                    ORDER BY display_name, id
            `,
            [ tenantID ])
        return res.rows.map(convertObjectKeysToCamelCase) as Account[]
    }

    async moveAccount(tenantID: Tenant["id"], id: Account["id"], newParentID: Account["id"] | null): Promise<Account> {
        const res = await this.pg.query(`
                    UPDATE accounts
                    SET parent_id = $3
                    WHERE tenant_id = $1 AND id = $2
            `,
            [ tenantID, id, newParentID ])
        if (res.rowCount != 1) {
            throw new Error(`Incorrect number of rows affected: ${JSON.stringify(res)}`)
        }
        return (await this.fetchAccount(tenantID, id))!
    }
}
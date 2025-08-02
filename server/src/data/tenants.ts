import {
    AccountType,
    MutationCreateTenantArgs,
    MutationDeleteTenantArgs,
    QueryTenantsArgs,
    SortDirection,
    Tenant,
    TenantsSortColumns,
    TenantsSortColumnsInput,
} from "../schema/graphql.js"
import { PoolClient } from "pg"
import { AccountsDataAccessLayer } from "./accounts.js"
import { convertObjectKeysToCamelCase } from "./pg_client.js"

type TenantSortColumnMapping = {
    [key in TenantsSortColumns]: string
}

export class TenantsDataAccessLayer {
    private readonly tenantSortColumnNames: TenantSortColumnMapping = {
        [TenantsSortColumns.Id]: "t.id",
        [TenantsSortColumns.DisplayName]: "t.display_name",
    }

    constructor(private readonly pg: PoolClient) {
    }

    async createTenant(accounts: AccountsDataAccessLayer, args: MutationCreateTenantArgs): Promise<Tenant> {
        const res = await this.pg.query(`
            INSERT INTO tenants (id, display_name)
            VALUES ($1, $2)
            RETURNING tenants.id AS id
        `, [ args.id, args.displayName ])
        if (res.rowCount != 1 || res.rows.length != 1) {
            throw new Error(`Incorrect number of rows affected or returned: ${JSON.stringify(res)}`)
        }

        await accounts.createAccount({
            tenantID: res.rows[0].id,
            id: "checkingAccounts",
            displayName: "Checking Accounts",
            type: AccountType.CheckingAccount,
            icon: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
</svg>`,
            parentID: null,
        })

        await accounts.createAccount({
            tenantID: res.rows[0].id,
            id: "unknown",
            displayName: "Unknown",
            type: null,
            icon: "<svg></svg>",
            parentID: null,
        })

        return (await this.fetchTenant(args.id))!
    }

    async deleteTenant(args: MutationDeleteTenantArgs): Promise<void> {
        const res = await this.pg.query(`
            DELETE
            FROM tenants
            WHERE id = $1
        `, [ args.id ])
        if (res.rowCount != 1) {
            throw new Error(`Incorrect number of rows affected: ${JSON.stringify(res)}`)
        }
    }

    async fetchTenant(id: Tenant["id"]): Promise<Tenant | null> {
        const res = await this.pg.query(`
                    SELECT id,
                           created_at,
                           updated_at,
                           display_name
                    FROM tenants
                    WHERE id = $1
            `,
            [ id ])
        if (res.rows.length == 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows.map(convertObjectKeysToCamelCase)[0] as Tenant
        }
    }

    async fetchTenants(args: QueryTenantsArgs): Promise<Tenant[]> {
        const res = await this.pg.query(`
            SELECT id, created_at, updated_at, display_name
            FROM tenants AS t
            ORDER BY ${this.buildTenantSorting(args.sort)}
        `)
        return res.rows.map(convertObjectKeysToCamelCase) as Tenant[]
    }

    private buildTenantSorting(sort?: TenantsSortColumnsInput[] | null): string[] {
        let sortCols: string[] = []
        if (sort && sort.length > 0) {
            for (let c of sort) {
                sortCols.push(`${this.tenantSortColumnNames[c.col]} ${c.direction}`)
            }
        }
        if (sortCols.length === 0) {
            sortCols.push(`${this.tenantSortColumnNames[TenantsSortColumns.DisplayName]} ${SortDirection.Asc}`)
        }
        sortCols.push(`${this.tenantSortColumnNames[TenantsSortColumns.Id]} ${SortDirection.Asc}`)
        return sortCols
    }
}
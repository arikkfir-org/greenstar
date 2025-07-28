import { PoolClient } from "pg"
import { Currency, CurrencyRate } from "../schema/graphql.js"
import { convertObjectKeysToCamelCase } from "./pg_client.js"
import { DateTime } from "luxon"

function mapCurrency(r: any) {
    return {
        date: r.date,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        rate: r.rate,
        sourceCurrency: {
            code: r.sourceCurrencyCode,
            createdAt: r.srcCurrCreatedAt,
            updatedAt: r.srcCurrUpdatedAt,
            symbol: r.srcCurrSymbol,
            nativeSymbol: r.srcCurrNativeSymbol,
            name: r.srcCurrName,
            decimalDigits: r.srcCurrDecimalDigits,
            countries: r.srcCurrCountries,
        },
        targetCurrency: {
            code: r.targetCurrencyCode,
            createdAt: r.tgtCurrCreatedAt,
            updatedAt: r.tgtCurrUpdatedAt,
            symbol: r.tgtCurrSymbol,
            nativeSymbol: r.tgtCurrNativeSymbol,
            name: r.tgtCurrName,
            decimalDigits: r.tgtCurrDecimalDigits,
            countries: r.tgtCurrCountries,
        },
    }
}

export class CurrenciesDataAccessLayer {
    constructor(private readonly pg: PoolClient) {
    }

    async fetchCurrency(code: Currency["code"]): Promise<Currency | null> {
        const res = await this.pg.query(`
                    SELECT code,
                           created_at,
                           updated_at,
                           country_codes AS countries,
                           decimal_digits,
                           name,
                           name_plural,
                           native_symbol,
                           symbol
                    FROM currencies
                    WHERE code = $1
            `,
            [ code ])
        if (res.rows.length == 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows.map(convertObjectKeysToCamelCase)[0] as Currency
        }
    }

    async fetchCurrencies(): Promise<Currency[]> {
        const res = await this.pg.query(`
                    SELECT code,
                           created_at,
                           updated_at,
                           country_codes AS countries,
                           decimal_digits,
                           name,
                           name_plural,
                           native_symbol,
                           symbol
                    FROM currencies
                    ORDER BY code
            `,
            [])
        return res.rows.map(convertObjectKeysToCamelCase) as Currency[]
    }

    async createCurrencyRate(
        date: DateTime,
        sourceCurrencyCode: string,
        targetCurrencyCode: string,
        rate: number,
    ): Promise<CurrencyRate> {
        const res = await this.pg.query(`
                    INSERT INTO rates (date, source_currency_code, target_currency_code, rate)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT ON CONSTRAINT uq_rates DO UPDATE SET rate = $4
            `,
            [ date, sourceCurrencyCode, targetCurrencyCode, rate ])

        if (res.rowCount !== 1) {
            throw new Error(`Expected 1 row to be affected, got ${res.rowCount}`)
        }

        return (await this.fetchCurrencyRate(date, sourceCurrencyCode, targetCurrencyCode))!
    }

    async fetchCurrencyRate(
        date: DateTime,
        sourceCurrencyCode: string,
        targetCurrencyCode: string,
    ): Promise<CurrencyRate | null> {
        const res = await this.pg.query(`
                    SELECT r.date,
                           r.source_currency_code,
                           r.target_currency_code,
                           r.rate,
                           r.created_at,
                           r.updated_at,
                           src.created_at     AS src_curr_created_at,
                           src.updated_at     AS src_curr_updated_at,
                           src.symbol         AS src_curr_symbol,
                           src.native_symbol  AS src_curr_native_symbol,
                           src.name           AS src_curr_name,
                           src.decimal_digits AS src_curr_decimal_digits,
                           src.country_codes  AS src_curr_countries,
                           tgt.created_at     AS tgt_curr_created_at,
                           tgt.updated_at     AS tgt_curr_updated_at,
                           tgt.symbol         AS tgt_curr_symbol,
                           tgt.native_symbol  AS tgt_curr_native_symbol,
                           tgt.name           AS tgt_curr_name,
                           tgt.decimal_digits AS tgt_curr_decimal_digits,
                           tgt.country_codes  AS tgt_curr_countries
                    FROM rates AS r
                             JOIN currencies AS src ON src.code = r.source_currency_code
                             JOIN currencies AS tgt ON tgt.code = r.target_currency_code
                    WHERE date = $1 AND source_currency_code = $2 AND target_currency_code = $3
            `,
            [ date, sourceCurrencyCode, targetCurrencyCode ])

        if (res.rows.length === 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows.map(convertObjectKeysToCamelCase).map(mapCurrency)[0] as CurrencyRate
        }
    }

    async fetchCurrencyRates(
        startDate?: DateTime,
        endDate?: DateTime,
        sourceCurrencyCode?: string,
        targetCurrencyCode?: string,
    ): Promise<CurrencyRate[]> {
        let query           = `
            SELECT r.date,
                   r.source_currency_code,
                   r.target_currency_code,
                   r.rate,
                   r.created_at,
                   r.updated_at,
                   src.created_at     AS src_curr_created_at,
                   src.updated_at     AS src_curr_updated_at,
                   src.symbol         AS src_curr_symbol,
                   src.native_symbol  AS src_curr_native_symbol,
                   src.name           AS src_curr_name,
                   src.decimal_digits AS src_curr_decimal_digits,
                   src.country_codes  AS src_curr_countries,
                   tgt.created_at     AS tgt_curr_created_at,
                   tgt.updated_at     AS tgt_curr_updated_at,
                   tgt.symbol         AS tgt_curr_symbol,
                   tgt.native_symbol  AS tgt_curr_native_symbol,
                   tgt.name           AS tgt_curr_name,
                   tgt.decimal_digits AS tgt_curr_decimal_digits,
                   tgt.country_codes  AS tgt_curr_countries
            FROM rates AS r
                     JOIN currencies AS src ON src.code = r.source_currency_code
                     JOIN currencies AS tgt ON tgt.code = r.target_currency_code
            WHERE TRUE
        `
        const params: any[] = []

        if (startDate) {
            params.push(startDate)
            query += ` AND date >= $${params.length}`
        }

        if (endDate) {
            params.push(endDate)
            query += ` AND date <= $${params.length}`
        }

        if (sourceCurrencyCode) {
            params.push(sourceCurrencyCode)
            query += ` AND source_currency_code = $${params.length}`
        }

        if (targetCurrencyCode) {
            params.push(targetCurrencyCode)
            query += ` AND target_currency_code = $${params.length}`
        }

        query += ` ORDER BY date, source_currency_code, target_currency_code`

        const res = await this.pg.query(query, params)
        return res.rows.map(convertObjectKeysToCamelCase).map(mapCurrency) as CurrencyRate[]
    }
}

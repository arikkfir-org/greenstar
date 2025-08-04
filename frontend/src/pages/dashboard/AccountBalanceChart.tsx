import { useContext, useEffect, useMemo, useState } from "react"
import { LineChartPro } from "@mui/x-charts-pro/LineChartPro"
import { useLazyQuery } from "@apollo/client"
import { gql } from "../../graphql"
import { useTenantID } from "../../hooks/tenant.ts"
import { SelectedCurrency, SelectedCurrencyContext } from "../../contexts/SelectedCurrency.ts"
import { DateTime } from "luxon"
import { Account, AccountBalanceOverTimeQueryQuery, BalancePoint, Tenant } from "../../graphql/graphql.ts"
import { buildErrorExtra, ErrorCard } from "../../components/ErrorCard.tsx"
import { Card, CardContent } from "@mui/material"

// GraphQL query to get account balance over time
const AccountsBalanceOverTime = gql(`
    query AccountBalanceOverTimeQuery($tenantID: ID!, $accountIDs: [ID!]!, $currency: String!, $endDate: DateTime) {
        tenant(id: $tenantID) {
            id
            accountsBalanceOverTime(accountIDs: $accountIDs, currency: $currency, endDate: $endDate) {
                account {
                    id
                    label: displayName
                }
                points {
                    date
                    balance
                }
            }
        }
    }
`)

interface AccountBalanceChartProps {
    accountIDs: Account["id"][]
}

type Series = { id: string, showMark: boolean, label: string, data: (number | null)[] }

function createXAxisData(data: AccountBalanceOverTimeQueryQuery) {
    const xAxisData: number[] = []
    for (const balance of data.tenant!.accountsBalanceOverTime) {
        for (let i = 0; i < balance.points.length; i++) {
            const p: BalancePoint              = balance.points[i]
            const lastSmallerDateIndex: number = xAxisData.findLastIndex(d => d < p.date.toJSDate()
                                                                                   .getTime())
            if (!xAxisData.includes(p.date.toJSDate().getTime())) {
                xAxisData.splice(lastSmallerDateIndex + 1, 0, p.date.toJSDate().getTime())
            }
        }
    }
    return xAxisData
}

function createAccountSeries(xAxisData: number[], data: AccountBalanceOverTimeQueryQuery) {
    const series: Series[] = data.tenant!.accountsBalanceOverTime.map(balance => {
        const data: (number | null)[] = []
        const { id, label }           = balance.account

        for (let i = 0; i < balance.points.length; i++) {
            const p: BalancePoint              = balance.points[i]
            const lastSmallerDateIndex: number = xAxisData.findLastIndex(d => d < p.date.toJSDate()
                                                                                   .getTime())
            data.push(...Array((lastSmallerDateIndex + 1) - data.length).fill(null), p.balance)
        }
        if (data.length < xAxisData.length) {
            data.push(...Array(xAxisData.length - data.length).fill(null))
        }
        return { id, label, showMark: false, data, connectNulls: true }
    })
    return series
}

export function AccountBalanceChart({ accountIDs }: AccountBalanceChartProps) {
    const tenantID: Tenant["id"]             = useTenantID()
    const selectedCurrency: SelectedCurrency = useContext(SelectedCurrencyContext)
    const [ fetch, result ]                  = useLazyQuery(AccountsBalanceOverTime)
    const [ xAxisData, setXAxisData ]        = useState<Date[] | undefined>()
    const [ series, setSeries ]              = useState<Series[] | undefined>()

    useEffect(
        () => {
            if (!accountIDs?.length) {
                if (xAxisData && series) {
                    setXAxisData([])
                    setSeries([])
                }
                return
            }

            fetch({
                variables: {
                    tenantID,
                    accountIDs,
                    currency: selectedCurrency?.currency?.code || "USD",
                    //endDate: DateTime.fromISO("2025-01-01", { setZone: true }),
                },
            }).then(
                fetchResult => {
                    if (fetchResult.error) {
                        throw fetchResult.error
                    } else if (fetchResult.loading) {
                        console.error("Can't use promise as it provides result still in loading status")
                        return
                    } else if (!fetchResult.data?.tenant?.accountsBalanceOverTime?.length) {
                        console.debug("No data returned for accounts balance request", fetchResult)
                        return
                    }

                    // Build the X axis first, to ensure all series are mapped to correct indices in it (dates)
                    const xAxisData = createXAxisData(fetchResult.data)

                    // Build the series line for each account, mapping each data point to the correct index in the X
                    // axis That means adding nulls for dates not present in the account's data points
                    const series = createAccountSeries(xAxisData, fetchResult.data)

                    setXAxisData(xAxisData.map(d => new Date(d)))
                    setSeries(series)
                })
        },
        [ fetch, tenantID, accountIDs, selectedCurrency?.currency?.code ],
    )

    type XAxisConfig = {
        data: Date[] | undefined
        scaleType: "time"
        valueFormatter: (value: any) => string
        label: string,
        zoom?: boolean,
    }
    type YAxisConfig = {
        width?: number
        label: string
        zoom?: boolean,
    }

    const xAxis: XAxisConfig[] = useMemo(
        (): XAxisConfig[] => ([
            {
                data: xAxisData,
                scaleType: "time",
                valueFormatter: (value: any) => DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_SHORT),
                label: "Time",
                zoom: true,
            },
        ]),
        [ xAxisData ],
    )

    const yAxis: YAxisConfig[] = useMemo(() => ([ { width: 100, label: "Balance", zoom: true } ]), [])

    return (
        <Card className="balance-chart-container" elevation={3}>
            <CardContent>
                {result.error && <ErrorCard title="Failed loading data"
                                            subTitle={result.error.message}
                                            extra={buildErrorExtra(result.error)} />}
                {!result.error && (
                    <LineChartPro xAxis={xAxis}
                                  yAxis={yAxis}
                                  series={series || []}
                                  skipAnimation
                    />
                )}
            </CardContent>
        </Card>
    )
}

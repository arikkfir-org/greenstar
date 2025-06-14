import { ReactNode, useMemo } from "react"
import { TransactionAccountInfo, TransactionRow } from "./TransactionRow.tsx"
import { DynamicIcon } from "../../components/DynamicIcon.tsx"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-premium"
import { Tooltip, Typography } from "@mui/material"
import { useCurrencyFormatter } from "../../hooks/locale.ts"
import { temporalColumn } from "../../util/datagrid.tsx"

// TODO: date display & editing format should be user-configurable

// valueSetter: (v: Date, r: TransactionRow): TransactionRow => ({ ...r, date: DateTime.fromJSDate(v) }),
// valueParser: (v?: string): Date => DateTime.fromFormat( v || "", "dd/MM/yyyy",{locale:navigator.language}).toJSDate()
// renderCell: (p: GridRenderCellParams<TransactionRow, Date, string>): ReactNode => (<>{p.value}</>),
// renderEditCell: (p: GridRenderCellParams<TransactionRow, Date, string>): ReactNode => (<>{p.value}</>),

export function useTransactionColumns(): GridColDef<TransactionRow>[] {
    const currencyFormatter = useCurrencyFormatter()
    return useMemo<GridColDef<TransactionRow>[]>((): GridColDef<TransactionRow>[] => {
        return [
            temporalColumn({
                field: "date",
                headerName: "Date",
                description: "Date of transaction",
            }),
            {
                field: "referenceID",
                headerName: "Reference ID",
                description: "Unique identifier for the transaction",
                flex: 0,
                type: "string",
            } as GridColDef<TransactionRow, string>,
            {
                field: "amount",
                headerName: "Amount",
                description: "Amount of currency transferred by this transaction",
                flex: 0,
                type: "number",
                groupable: false,
                pivotable: false,
                valueFormatter: (v: number, r: TransactionRow) => currencyFormatter(v, r.currency),
            } as GridColDef<TransactionRow, number, string>,
            {
                field: "description",
                headerName: "Description",
                description: "General description of the transaction",
                flex: 1,
                type: "string",
                display: "flex",
                renderCell: (p: GridRenderCellParams<TransactionRow, string>): ReactNode => (
                    <Tooltip title={p.value || "None"}>
                        <Typography>{p.value || "None"}</Typography>
                    </Tooltip>
                ),
            } as GridColDef<TransactionRow, string>,
            {
                field: "sourceAccount",
                headerName: "Source",
                description: "Transaction source account where currency was transferred from",
                flex: 0.5,
                type: "string",
                sortComparator: (v1: TransactionAccountInfo, v2: TransactionAccountInfo): number =>
                    v1.displayName.localeCompare(v2.displayName),
                display: "flex",
                renderCell: (p: GridRenderCellParams<TransactionRow, TransactionAccountInfo, string>): ReactNode => (
                    <>
                        {p.value && <DynamicIcon svgString={p.value?.icon} />}
                        <div style={{ flexGrow: 0, flexShrink: 0, width: "1em" }}></div>
                        <Typography>{p.value?.displayName}</Typography>
                    </>
                ),
            } as GridColDef<TransactionRow, TransactionAccountInfo, string>,
            {
                field: "targetAccount",
                headerName: "Target",
                description: "Transaction target account where currency was transferred to",
                flex: 0.5,
                type: "string",
                display: "flex",
                sortComparator: (v1: TransactionAccountInfo, v2: TransactionAccountInfo): number =>
                    v1.displayName.localeCompare(v2.displayName),
                renderCell: (p: GridRenderCellParams<TransactionRow, TransactionAccountInfo, string>): ReactNode => (
                    <>
                        <DynamicIcon svgString={p.value!.icon} />
                        <div style={{ flexGrow: 0, flexShrink: 0, width: "1em" }}></div>
                        <Typography>{p.value?.displayName}</Typography>
                    </>
                ),
            } as GridColDef<TransactionRow, TransactionAccountInfo, string>,
        ]
    }, [ currencyFormatter ])
}

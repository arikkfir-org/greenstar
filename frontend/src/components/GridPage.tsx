import "./ScrapersPage.scss"
import { Paper } from "@mui/material"
import { DataGrid, DataGridProps } from "./DataGrid.tsx"
import type { GridValidRowModel } from "@mui/x-data-grid-premium"

export interface GridPageProps<Row extends GridValidRowModel> {
    title: string
    tableProps: DataGridProps<Row>
}

export function GridPage<Row extends GridValidRowModel>({ title, tableProps }: GridPageProps<Row>) {
    return (
        <main className="gridpage">
            <title>{title}</title>

            <Paper className="container" elevation={3}>
                <DataGrid<Row> {...tableProps} />
            </Paper>
        </main>
    )
}

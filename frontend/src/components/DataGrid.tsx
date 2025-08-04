import { ReactNode, useCallback, useMemo, useState } from "react"
import {
    ColumnsPanelTrigger,
    DataGridPremium,
    DataGridPremiumProps,
    GridColDef,
    GridRenderCellParams,
    GridValidRowModel,
    Toolbar,
    ToolbarButton,
} from "@mui/x-data-grid-premium"
import "./DataGrid.scss"
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ViewColumnIcon from "@mui/icons-material/ViewColumn"

export interface Action<Row extends GridValidRowModel> {
    disabled?: boolean
    handler: (row: Row) => void,
    icon: ReactNode,
    key: string,
    title: string,
}

export interface DataGridProps<Row extends GridValidRowModel>
    extends Omit<DataGridPremiumProps<Row>, "showToolbar" | "slots"> {
    newAction?: () => void,
    newActionIcon?: ReactNode,
    rowActions?: Action<Row>[]
    rows?: Row[]
    errorLoading?: Error
}

export function DataGrid<Row extends GridValidRowModel>(props: DataGridProps<Row>) {
    const [ snackbarMessage, setSnackbarMessage ] = useState<string | null>(null)

    const createHandleAction = (action: Action<Row>, row: Row) => {
        try {
            action.handler(row)
        } catch (e) {
            setSnackbarMessage(e instanceof Error ? e.message : "Internal error occurred")
        }
    }

    const handleNewAction = useCallback(
        () => {
            if (props.newAction) {
                try {
                    props.newAction()
                } catch (e) {
                    setSnackbarMessage(e instanceof Error ? e.message : "Internal error occurred")
                }
            }
        },
        [ setSnackbarMessage, props ],
    )

    const renderActionsCell = useCallback(
        (p: GridRenderCellParams<Row>) => (
            <div className="actions-cell">
                {props.rowActions?.map(action => (
                    <Tooltip title={action.title} key={action.key}>
                        <IconButton size="small"
                                    onClick={() => createHandleAction(action, p.row)}
                                    disabled={action.disabled}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </div>
        ),
        [ props.rowActions ],
    )

    const columns: GridColDef<Row>[] = useMemo(
        (): GridColDef<Row>[] => {
            const columns = [...props.columns]
            if(props.rowActions) {
                columns.push({
                    aggregable: false,
                    editable: false,
                    field: "actions",
                    flex: 1,
                    filterable: false,
                    headerName: "Actions",
                    groupable: false,
                    pinnable: false,
                    pivotable: false,
                    sortable: false,
                    renderCell: renderActionsCell,
                })
            }
            return columns
        },
        [ props.columns, renderActionsCell, props.rowActions ],
    )

    const toolbar = () => (
        <Toolbar>
            {props.newAction && (
                <Tooltip title="New">
                    <ToolbarButton onClick={handleNewAction}>
                        {props.newActionIcon ? props.newActionIcon : (
                            <AddIcon fontSize="small" />
                        )}
                    </ToolbarButton>
                </Tooltip>
            )}
            <Tooltip title="Columns">
                <ColumnsPanelTrigger render={<ToolbarButton />}>
                    <ViewColumnIcon fontSize="small" />
                </ColumnsPanelTrigger>
            </Tooltip>
        </Toolbar>
    )

    return (
        <div className="gridpage-table-content">
            <Snackbar open={!!props.errorLoading} message={props.errorLoading?.message} />
            <Snackbar
                open={snackbarMessage !== null}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage(null)}
                message={snackbarMessage}
            />
            <DataGridPremium<Row>
                rows={props.rows || []}
                showToolbar
                columns={columns}
                loading={props.loading}
                slots={{
                    toolbar,
                    noRowsOverlay: () => (
                        <div>
                            {props.errorLoading
                                ? <Alert severity="error">{props.errorLoading.message}</Alert>
                                : <Alert severity="info">No rows found</Alert>}
                        </div>
                    ),
                }}
            />
        </div>
    )
}

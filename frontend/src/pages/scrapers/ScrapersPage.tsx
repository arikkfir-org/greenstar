import "./ScrapersPage.scss"
import { Drawer, Paper } from "@mui/material"
import { Action, DataGrid } from "../../components/DataGrid.tsx"
import { GridColDef } from "@mui/x-data-grid-premium"
import { DeleteScraper, ScraperRow, Scrapers } from "./ScrapersQueries.ts"
import { useCallback, useMemo } from "react"
import { useTenantID } from "../../hooks/tenant.ts"
import { useMutation, useQuery } from "@apollo/client"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { ScraperDrawer } from "./scraper/ScraperDrawer.tsx"
import { enqueueSnackbar } from "notistack"
import { dismissAction } from "../../util/notistack-actions.tsx"
import { temporalColumn } from "../../util/datagrid.tsx"
import { Route, useLocation } from "wouter"

export function ScrapersPage() {
    const [ _location, navigate ] = useLocation()

    const tenantID: string = useTenantID()

    const { data: scrapers, loading, error: loadingError, refetch } = useQuery(Scrapers, { variables: { tenantID } })
    const [ deleteScraper, { loading: deleting } ]                  = useMutation(DeleteScraper)

    const columns: GridColDef<ScraperRow>[] = useMemo(
        (): GridColDef<ScraperRow>[] => [
            { field: "id", headerName: "ID", flex: 1 },
            temporalColumn({ field: "createdAt", headerName: "Created" }),
            temporalColumn({ field: "updatedAt", headerName: "Updated" }),
            { field: "displayName", headerName: "Name", flex: 1 },
            {
                field: "type",
                headerName: "Type",
                flex: 1,
                valueGetter: (value: { displayName: string }) => value.displayName,
            },
            temporalColumn({ field: "lastSuccessfulScrapedDate", headerName: "Last Successful Scrape" }),
        ],
        [],
    )

    const handleDelete = useCallback(
        async ({ id }: ScraperRow) => {
            const result = await deleteScraper({ variables: { tenantID, id } })
            if (!result.errors?.length) {
                enqueueSnackbar("Scraper deleted successfully", { action: dismissAction })
                await refetch()
            }
        },
        [ deleteScraper, tenantID, refetch ],
    )

    const handleScraperSaved = useCallback(
        async () => await refetch(),
        [ refetch ],
    )

    const actions: Action<ScraperRow>[] = useMemo(
        (): Action<ScraperRow>[] => [
            {
                key: "edit",
                title: "Edit",
                handler: (row) => navigate(`/${row.id}`),
                disabled: loading || deleting,
                icon: <EditIcon fontSize="small" />,
            },
            {
                key: "delete",
                title: "Delete",
                handler: handleDelete,
                disabled: loading || deleting,
                icon: <DeleteIcon fontSize="small" />,
            },
        ],
        [ navigate, handleDelete, loading, deleting ],
    )

    return (
        <main className="scrapers-page">
            <title>Scrapers - GreenSTAR</title>
            <Paper className="scrapers-container" elevation={3}>
                <DataGrid<ScraperRow> columns={columns}
                                      newAction={() => navigate(`/new`)}
                                      rowActions={actions}
                                      rows={scrapers?.tenant?.scrapers || []}
                                      loading={loading}
                                      errorLoading={loadingError}
                                      initialState={{
                                          columns: {
                                              columnVisibilityModel: {
                                                  id: false,
                                              },
                                          },
                                      }} />
            </Paper>
            <Route path="/new">
                {() => (
                    <Drawer open={true} anchor="right" onClose={() => navigate(`/`)}>
                        <ScraperDrawer onScraperSaved={handleScraperSaved} />
                    </Drawer>
                )}
            </Route>
            <Route path="/:id" nest>
                {(params) => (
                    <Drawer open={true} anchor="right" onClose={() => navigate(``)}>
                        <ScraperDrawer scraperID={params.id} onScraperSaved={handleScraperSaved} />
                    </Drawer>
                )}
            </Route>
        </main>
    )
}

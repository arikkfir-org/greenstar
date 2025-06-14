import { useCallback, useMemo } from "react"
import { enqueueSnackbar, SnackbarKey } from "notistack"
import { Scraper, Tenant } from "../../../graphql/graphql.ts"
import { ScraperJobRow, ScraperJobs, TriggerScraper } from "../ScrapersQueries.ts"
import { useMutation, useQuery } from "@apollo/client"
import { useTenantID } from "../../../hooks/tenant.ts"
import { Action, DataGrid } from "../../../components/DataGrid.tsx"
import { GridColDef } from "@mui/x-data-grid-premium"
import { temporalColumn } from "../../../util/datagrid.tsx"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import EditIcon from "@mui/icons-material/Edit"
import { useLocation } from "wouter"
import { Button } from "@mui/material"
import { dismissAction } from "../../../util/notistack-actions.tsx"

export interface JobsTableProps {
    scraperID: Scraper["id"]
}

export function JobsTable({ scraperID }: JobsTableProps) {
    const [ location, navigate ] = useLocation()

    const tenantID: Tenant["id"] = useTenantID()

    const [ triggerScraper, { loading: triggering } ]      = useMutation(TriggerScraper)
    const { data: jobs, error: errorLoadingJobs, loading } = useQuery(ScraperJobs, {
        pollInterval: location == "/" ? 1000 : 0,
        variables: { tenantID, scraperID },
    })

    const handleTrigger = useCallback(
        async () => {
            const result = await triggerScraper({ variables: { tenantID, scraperID } })
            if (!result.errors?.length && result.data?.triggerScraper) {
                const scraperJobID = result.data.triggerScraper.id
                enqueueSnackbar(`New scraper job triggered`, {
                    action: (snackbarId: SnackbarKey) => (
                        <>
                            <Button variant="text" onClick={() => navigate("/jobs/"+scraperJobID)}>View</Button>
                            {dismissAction(snackbarId)}
                        </>
                    ),
                })
            }
        },
        [ triggerScraper, tenantID, scraperID, navigate ],
    )

    const columns: GridColDef<ScraperJobRow>[] = useMemo(
        (): GridColDef<ScraperJobRow>[] => [
            { field: "id", headerName: "ID", flex: 1 },
            temporalColumn({ field: "createdAt", headerName: "Created" }),
            { field: "status", headerName: "Status", flex: 1 },
        ],
        [],
    )

    const actions: Action<ScraperJobRow>[] = useMemo(
        (): Action<ScraperJobRow>[] => [
            {
                key: "open",
                title: "Open",
                handler: row => navigate(`/jobs/${row.id}`),
                disabled: loading,
                icon: <EditIcon fontSize="small" />,
            },
        ],
        [ loading, navigate ],
    )

    return (
        <DataGrid<ScraperJobRow> columns={columns}
                                 newAction={handleTrigger}
                                 newActionIcon={<PlayArrowIcon fontSize="small" />}
                                 rowActions={actions}
                                 rows={jobs?.tenant?.scraper?.jobs || []}
                                 loading={loading || triggering}
                                 errorLoading={errorLoadingJobs}
                                 initialState={{
                                     columns: {
                                         columnVisibilityModel: {
                                             id: false,
                                         },
                                     },
                                 }} />
    )
}

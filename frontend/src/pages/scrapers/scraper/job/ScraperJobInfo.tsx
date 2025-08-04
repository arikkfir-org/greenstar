import { SingleScraperJobRow } from "../../ScrapersQueries.ts"
import { ScraperJobStatus, ScraperParameterType, Tenant } from "../../../../graphql/graphql.ts"
import { useTenantID } from "../../../../hooks/tenant.ts"
import { useMemo, useState } from "react"
import { apiURL } from "../../../../util/ApolloClient.ts"
import { Button, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"

export interface ScraperJobInfoProps {
    job: SingleScraperJobRow
}

export function ScraperJobInfo({ job }: ScraperJobInfoProps) {
    const tenantID: Tenant["id"] = useTenantID()

    const traceURL = useMemo(
        () => `https://trace.playwright.dev/?trace=${apiURL}/static/${tenantID}/${job.id}-trace.zip`,
        [ tenantID, job.id ],
    )

    const [ traceAnchorEl, setTraceAnchorEl ] = useState<HTMLElement | null>(null)
    const tracePopoverOpen: boolean           = Boolean(traceAnchorEl)

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableBody>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>ID</TableCell>
                        <TableCell>{job.id}</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>Created</TableCell>
                        <TableCell>{job.createdAt.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>Status</TableCell>
                        <TableCell>
                            {job.status}
                            {[ ScraperJobStatus.Successful, ScraperJobStatus.Failed ].includes(job.status) && (
                                <>
                                    <Button variant="contained"
                                            onClick={() => window.open(traceURL, "_blank")}
                                            onMouseEnter={e => setTraceAnchorEl(e.currentTarget)}
                                            onMouseLeave={() => setTraceAnchorEl(null)}>
                                        Trace
                                    </Button>
                                    <Popover id="trace-popover"
                                             sx={{ marginTop: "0.5em", pointerEvents: "none" }}
                                             open={tracePopoverOpen}
                                             anchorEl={traceAnchorEl}
                                             anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                             transformOrigin={{ vertical: "top", horizontal: "center" }}
                                             onClose={() => setTraceAnchorEl(null)}
                                             disableRestoreFocus>
                                        <img className="trace" alt="trace" src="/trace.png" />
                                    </Popover>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ verticalAlign: "baseline" }}>Parameters</TableCell>
                        <TableCell sx={{ paddingLeft: 0 }}>
                            <Table size="small">
                                <TableBody sx={{
                                    "tr:first-of-type > td": { paddingTop: 0 },
                                    "tr:last-child > td": { border: 0 },
                                }}>
                                    {job.parameters.map(p => (
                                        <TableRow key={p.parameter.id}>
                                            <TableCell>{p.parameter.displayName}</TableCell>
                                            <TableCell>
                                                {p.parameter.type == ScraperParameterType.Password
                                                    ? "*".repeat(p.value.length)
                                                    : p.value}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

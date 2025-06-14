import { SingleScraperJobRow } from "../../ScrapersQueries.ts"
import { Tenant } from "../../../../graphql/graphql.ts"
import { useTenantID } from "../../../../hooks/tenant.ts"
import { apiHost } from "../../../../util/ApolloClient.ts"
import { useEffect, useMemo, useRef, useState } from "react"
import { Alert } from "@mui/material"
import { LazyLog } from "@melloware/react-logviewer"

const protocol             = window.location.protocol === "https:" ? "wss:" : "ws:"

export interface ScraperJobLogsProps {
    job: SingleScraperJobRow
    onReadCompletion?: (successful: boolean) => void
}

export function ScraperJobLogs({ job, onReadCompletion }: ScraperJobLogsProps) {
    const tenantID: Tenant["id"] = useTenantID()

    const wsUrl = `${protocol}//${apiHost}/ws/scraper-job-logs?tenantID=${tenantID}&scraperID=${job.scraper.id}&scraperJobID=${job.id}`
    const wsRef = useRef<WebSocket | null>(null)

    const [ logLines, setLogLines ] = useState<string[]>([])
    const [ logError, setLogError ] = useState<string | null>(null)

    useEffect(() => {
        setLogLines([])
        setLogError(null)

        const ws = new WebSocket(wsUrl)

        ws.onopen = () => wsRef.current = ws

        let readLogsToCompletion = false
        ws.onmessage             = (event) => {
            if (event.data === "DONE") {
                readLogsToCompletion = true
                setLogLines(prevLines => prevLines.slice(0, -1))
            } else {
                setLogLines(prevLines => prevLines.slice(0, -1).concat(event.data, "Loading..."))
            }
        }

        ws.onerror = () => wsRef.current === ws && setLogError("Failed connecting to log stream")
        ws.onclose = async () => {
            if (wsRef.current === ws) {
                wsRef.current = null
                if (onReadCompletion) {
                    onReadCompletion(readLogsToCompletion)
                }
            }
        }
        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close()
            }
            if (wsRef.current === ws) {
                wsRef.current = null
            }
        }
    }, [])

    const logs = useMemo(() => logLines.join("\n"), [ logLines ])

    return (
        <>
            {logError && <Alert severity="error">{logError}</Alert>}
            <LazyLog caseInsensitive={true}
                     enableGutters={true}
                     enableHotKeys={true}
                     enableLineNumbers={true}
                     enableLinks={true}
                     enableMultilineHighlight={true}
                     enableSearch
                     enableSearchNavigation={true}
                     external={false}
                     extraLines={1}
                     follow
                     selectableLines={true}
                     text={logs} />
        </>
    )
}

import { WebSocket, WebSocketServer } from "ws"
import * as http from "node:http"
import { URL } from "url"
import { ScraperJobStatus } from "./schema/graphql.js"
import { ScrapersDataAccessLayer } from "./data/scrapers.js"
import { pgPool } from "./data/pg_client.js"
import { IncomingMessage } from "http"

// Initialize WebSocket server
export function initWebSocketServer(server: http.Server): void {
    const wss = new WebSocketServer({ noServer: true })

    // Handle upgrade requests
    server.on("upgrade", async (request: IncomingMessage, socket, head) => {
        if (!request.url) {
            socket.destroy()
            return
        }

        // noinspection HttpUrlsUsage
        const url = new URL(request.url, `https://${request.headers.host}`)

        // Handle scraper job logs websocket endpoint
        if (url.pathname.startsWith("/ws/scraper-job-logs")) {
            const tenantID     = url.searchParams.get("tenantID")
            const scraperID    = url.searchParams.get("scraperID")
            const scraperJobID = url.searchParams.get("scraperJobID")

            if (!tenantID || !scraperID || !scraperJobID) {
                socket.write("HTTP/1.1 400 Bad Request\r\n\r\n")
                socket.destroy()
                return
            }

            wss.handleUpgrade(request, socket, head, (ws) => {
                console.debug(`WebSocket connection established for scraper job logs: ${tenantID}/${scraperID}/${scraperJobID}`)
                streamScraperJobLogs(ws, tenantID, scraperJobID)
            })
        } else {
            socket.destroy()
        }
    })
}

async function streamScraperJobLogs(ws: WebSocket, tenantID: string, scraperJobID: string): Promise<void> {

    const sentLogLines = new Set<string>()

    const fetchAndSendLogs = async () => {
        const client = await pgPool.connect()
        try {
            const scrapersDal = new ScrapersDataAccessLayer(client)

            let job = await scrapersDal.fetchScraperJob(tenantID, scraperJobID)
            if (!job) {
                console.debug(`Job ${scraperJobID} not found, closing WebSocket connection`)
                ws.close()
                return
            }

            const inProgressStatuses = [ ScraperJobStatus.Pending, ScraperJobStatus.Running ]
            do {
                const logLines = await scrapersDal.fetchScraperJobLogs(tenantID, scraperJobID)
                for (const line of logLines) {
                    if (line && !sentLogLines.has(line)) {
                        sentLogLines.add(line)
                        ws.send(line)
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 500))
                job = await scrapersDal.fetchScraperJob(tenantID, scraperJobID)

            } while (job && inProgressStatuses.includes(job?.status || ScraperJobStatus.Pending))

            ws.send("DONE")
            ws.close()

        } catch (error) {
            console.error(`Failed fetching job logs: ${error}`)
            ws.close()
            return false
        } finally {
            client.release()
        }
    }

    // Start fetching logs
    await fetchAndSendLogs()
}

import { Scraper, ScraperJob, ScraperJobStatus, Tenant } from "../../../../graphql/graphql.ts"
import { useTenantID } from "../../../../hooks/tenant.ts"
import { useMemo, useState } from "react"
import { Alert, Tab, Tabs, Typography } from "@mui/material"
import "./ScraperJobDrawer.scss"
import { apiURL } from "../../../../util/ApolloClient.ts"
import { useQuery } from "@apollo/client"
import { ScraperJob as ScraperJobQuery } from "../../ScrapersQueries.ts"
import CircularProgress from "@mui/material/CircularProgress"
import { ScraperJobLogs } from "./ScraperJobLogs.tsx"
import { ScraperJobInfo } from "./ScraperJobInfo.tsx"

export interface ScraperJobDrawerProps {
    scraperID: Scraper["id"]
    scraperJobID: ScraperJob["id"]
}

export function ScraperJobDrawer({ scraperID, scraperJobID }: ScraperJobDrawerProps) {
    const tenantID: Tenant["id"] = useTenantID()
    const videoURL               = useMemo(
        () => `${apiURL}/static/${tenantID}/${scraperJobID}-video.webm`,
        [ tenantID, scraperJobID ],
    )

    const { data: jobData, loading: loadingJob, error: jobError, refetch } = useQuery(ScraperJobQuery, {
        variables: {
            tenantID,
            scraperID: scraperID,
            scraperJobID,
        },
    })

    const job = useMemo(
        () => jobData?.tenant?.scraper?.job,
        [ jobData?.tenant?.scraper?.job ],
    )

    const jobCompleted = useMemo(
        () => !!job?.status && [ ScraperJobStatus.Successful, ScraperJobStatus.Failed ].includes(job?.status),
        [ job?.status ],
    )

    const handleJobLogsReadCompletion = async (successful: boolean) => {
        if (!jobCompleted && successful) {
            await refetch()
        }
    }

    const [ tab, setTab ] = useState<"video" | "logs">("logs")

    return (
        <article className="scraper-job-drawer">
            <Typography variant="h2">Scraper Job details</Typography>
            {jobError && <Alert severity="error">{jobError.message}</Alert>}
            {loadingJob && (<CircularProgress />)}
            {job && (
                <>
                    <ScraperJobInfo job={job} />
                    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                        <Tab value="logs" label="Logs" />
                        {jobCompleted && <Tab value="video" label="Video" disabled={!jobCompleted} />}
                    </Tabs>
                    <div className="tab logs" hidden={tab != "logs"}>
                        <ScraperJobLogs job={job} onReadCompletion={handleJobLogsReadCompletion} />
                    </div>
                    {jobCompleted && (
                        <div className="tab video" hidden={tab != "video"}>
                            <video controls autoPlay loop muted>
                                <source src={videoURL} type="video/webm" />
                                Your browser does not support the video tag or the WebM format.
                                Please try a different browser or device.
                            </video>
                        </div>
                    )}
                </>
            )}
        </article>
    )
}

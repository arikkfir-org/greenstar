import { Scraper, Tenant, UpsertScraperMutation } from "../../../graphql/graphql.ts"
import { Divider, Drawer, Typography } from "@mui/material"
import { useCallback } from "react"
import "./ScraperDrawer.scss"
import { Scraper as ScraperQuery, ScraperRow } from "../ScrapersQueries.ts"
import { Form } from "./Form.tsx"
import { Route, useLocation } from "wouter"
import { useQuery } from "@apollo/client"
import { JobsTable } from "./JobsTable.tsx"
import { ScraperJobDrawer } from "./job/ScraperJobDrawer.tsx"
import { useTenantID } from "../../../hooks/tenant.ts"

export interface ScraperDrawerProps {
    scraperID?: Scraper["id"],
    onScraperSaved: (scraper: UpsertScraperMutation["upsertScraper"]) => void
}

export function ScraperDrawer({ scraperID, onScraperSaved }: ScraperDrawerProps) {
    const [ _location, navigate ] = useLocation()

    const tenantID: Tenant["id"]     = useTenantID()
    const { data: scraper, loading } = useQuery(ScraperQuery, {
        skip: !scraperID, variables: {
            tenantID,
            scraperID: scraperID!,
        },
    })

    const handleScraperSave = useCallback(
        async (scraper: ScraperRow) => onScraperSaved(scraper),
        [ onScraperSaved ],
    )

    return (
        <article className="scraper-drawer">
            <Typography variant="h2">Scraper details</Typography>
            <Divider />
            {!loading && (scraper || !scraperID) && (
                <>
                    <Form onSave={handleScraperSave}
                          scraperID={scraperID}
                          displayName={scraper?.tenant?.scraper?.displayName}
                          scraperTypeID={scraper?.tenant?.scraper?.type.id}
                          parameters={scraper?.tenant?.scraper?.parameters} />
                    <Divider />
                    {scraper?.tenant?.scraper && <JobsTable scraperID={scraper.tenant.scraper.id} />}
                    {scraperID && (
                        <Route path="/jobs/:id" nest>
                            {(params) => (
                                <Drawer open={true} anchor="right" onClose={() => navigate(``)}>
                                    <ScraperJobDrawer scraperID={scraperID} scraperJobID={params.id} />
                                </Drawer>
                            )}
                        </Route>
                    )}
                </>
            )}
        </article>
    )
}

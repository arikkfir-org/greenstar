import "./ErrorPage.scss"
import { Divider, Paper, Typography } from "@mui/material"

export function PageNotFoundErrorPage() {
    return (
        <main className="error-page">
            <title>Page not found - GreenSTAR</title>
            <Paper elevation={3} className="container">
                <Typography variant="h3">Ooops, this is embarrassing!</Typography>
                <Divider/>
                <Typography variant="body1">
                    We could not find the page you are looking for.
                </Typography>
                <Typography variant="body1">
                    This might have been caused by an issue in our system, or you may have saved a partial link to a page.
                </Typography>
            </Paper>
        </main>
    )
}

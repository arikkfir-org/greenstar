import "./ErrorPage.scss"
import { Divider, Paper, Typography } from "@mui/material"

export function LoadingErrorPage() {
    return (
        <main className="error-page">
            <title>Load Error - GreenSTAR</title>
            <Paper elevation={3} className="container">
                <Typography variant="h3">Ooops, the application has failed to load!</Typography>
                <Divider/>
                <Typography variant="body1">
                    That's all we know.
                </Typography>
            </Paper>
        </main>
    )
}

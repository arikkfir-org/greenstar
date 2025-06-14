import { Button } from "@mui/material"
import { closeSnackbar, SnackbarKey } from "notistack"

export const dismissAction = (snackbarId: SnackbarKey) => (
    <Button variant="text" onClick={() => closeSnackbar(snackbarId)}>
        Dismiss
    </Button>
)

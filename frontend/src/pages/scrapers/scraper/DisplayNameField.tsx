import { Scraper, ScraperType } from "../../../graphql/graphql.ts"
import { TextField } from "@mui/material"

interface DisplayNameFieldProps {
    disabled?: boolean
    handleChange: (value: Scraper["displayName"]) => void
    loading?: boolean,
    value?: ScraperType["id"]
}

export function DisplayNameField({ disabled, handleChange, loading, value }: DisplayNameFieldProps) {
    return (
        <TextField
            error={!value}
            label="Display name"
            required
            disabled={disabled || loading}
            fullWidth
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            helperText={!value ? "Required" : ""}
        />
    )
}

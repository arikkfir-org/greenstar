import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { ScraperType } from "../../../graphql/graphql.ts"
import { ScraperTypeRow } from "../ScrapersQueries.ts"

export interface TypeSelectFieldProps {
    disabled?: boolean
    handleChange: (e: SelectChangeEvent<ScraperType["id"]>) => void
    scraperTypes?: ScraperTypeRow[]
    value?: ScraperType["id"]
}

export function TypeSelectField({
    disabled,
    handleChange,
    scraperTypes,
    value,
}: TypeSelectFieldProps) {
    return (
        <FormControl fullWidth>
            <InputLabel id="scraperType-label">Type</InputLabel>
            <Select<ScraperType["id"]>
                labelId="scraperType-label"
                id="scraperType"
                disabled={disabled}
                value={scraperTypes?.length && value || ""}
                label="Type"
                onChange={handleChange}
            >
                {scraperTypes?.map(type => (
                    <MenuItem value={type.id}>{type.displayName}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

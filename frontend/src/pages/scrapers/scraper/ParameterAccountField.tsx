import { AccountForScraperAccountParameterRow } from "../ScrapersQueries.ts"
import { Account, ScraperParameter, ScraperTypeParameter } from "../../../graphql/graphql.ts"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

export interface ParameterAccountFieldProps {
    accounts?: AccountForScraperAccountParameterRow[]
    disabled?: boolean
    handleChange: (parameter: ScraperParameter, value: ScraperParameter["value"]) => void
    parameter: ScraperParameter,
}

type AccountID = Account["id"]

export function ParameterAccountField(props: ParameterAccountFieldProps) {
    const { accounts, disabled, handleChange, parameter } = props
    const labelId: ScraperTypeParameter["id"]             = parameter.parameter.id + "-account-label"
    return (
        <FormControl fullWidth key={parameter.parameter.id}>
            <InputLabel id={labelId}>{parameter.parameter.displayName}</InputLabel>
            <Select<AccountID>
                labelId={labelId}
                disabled={disabled}
                value={accounts?.length && parameter.value || ""}
                label={parameter.parameter.displayName}
                onChange={e => handleChange(parameter, e.target.value)}
            >
                {accounts?.map(account => (
                    <MenuItem value={account.id}>{account.displayName}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

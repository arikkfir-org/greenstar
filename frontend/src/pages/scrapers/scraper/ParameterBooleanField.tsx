import { ScraperParameter } from "../../../graphql/graphql.ts"
import { Checkbox, FormControlLabel } from "@mui/material"

export interface BooleanParameterProps {
    disabled?: boolean
    handleChange: (parameter: ScraperParameter, value: ScraperParameter["value"]) => void
    parameter: ScraperParameter,
}

export function ParameterBooleanField(props: BooleanParameterProps) {
    const { disabled, handleChange, parameter } = props
    return (
        <FormControlLabel
            key={parameter.parameter.id}
            control={
                <Checkbox
                    checked={parameter.value === "true"}
                    disabled={disabled}
                    onChange={(_, checked) => handleChange(parameter, checked + "")} />
            }
            label={parameter.parameter.displayName} />
    )
}

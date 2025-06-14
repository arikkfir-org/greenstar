import { ScraperParameter } from "../../../graphql/graphql.ts"
import { InputHTMLAttributes } from "react"
import { TextField } from "@mui/material"

export interface ParameterTextFieldProps {
    disabled?: boolean
    handleChange: (parameter: ScraperParameter, value: ScraperParameter["value"]) => void
    parameter: ScraperParameter,
    required?: boolean
    type?: InputHTMLAttributes<unknown>["type"]
    validator: (s: string) => boolean,
}

export function ParameterTextField(props: ParameterTextFieldProps) {
    const { disabled, handleChange, parameter, required, validator } = props
    return (
        <TextField
            autoComplete="off"
            disabled={disabled}
            error={!validator(parameter.value)}
            helperText={!validator(parameter.value) && "Invalid value"}
            key={parameter.parameter.id}
            label={parameter.parameter.displayName}
            onChange={(event) => handleChange(parameter, event.target.value)}
            required={required}
            type="text"
            value={parameter.value}
        />
    )
}

import { AccountForScraperAccountParameterRow } from "../ScrapersQueries.ts"
import { ScraperParameter, ScraperParameterType } from "../../../graphql/graphql.ts"
import { DatePicker } from "@mui/x-date-pickers-pro"
import { DateTime } from "luxon"
import { ParameterAccountField } from "./ParameterAccountField.tsx"
import { ParameterBooleanField } from "./ParameterBooleanField.tsx"
import { ParameterTextField } from "./ParameterTextField.tsx"
import { ParameterPasswordField } from "./ParameterPasswordField.tsx"

export interface ParameterFieldProps {
    accounts?: AccountForScraperAccountParameterRow[]
    disabled?: boolean
    handleChange: (parameter: ScraperParameter, value: ScraperParameter["value"]) => void
    loading?: boolean,
    parameter: ScraperParameter,
}

export function ParameterField(props: ParameterFieldProps) {
    const { accounts, disabled, handleChange, loading, parameter } = props
    switch (parameter.parameter.type) {
        case ScraperParameterType.Account:
            return (
                <ParameterAccountField accounts={accounts}
                                       disabled={disabled}
                                       handleChange={handleChange}
                                       parameter={parameter} />
            )
        case ScraperParameterType.Boolean:
            return (
                <ParameterBooleanField disabled={disabled} handleChange={handleChange} parameter={parameter} />
            )
        case ScraperParameterType.Date:
            return <DatePicker
                disabled={disabled || loading}
                loading={loading}
                label={parameter.parameter.displayName}
                value={DateTime.fromISO(parameter.value)}
                onChange={(value) => handleChange(parameter, value ? value.toISO()! : "")}
            />
        case ScraperParameterType.Float:
            return (
                <ParameterTextField disabled={disabled}
                                    handleChange={handleChange}
                                    parameter={parameter}
                                    required
                                    validator={(s) => /^-?\d+(\.\d+)?$/.test(s)}
                />
            )
        case ScraperParameterType.Integer:
            return (
                <ParameterTextField disabled={disabled}
                                    handleChange={handleChange}
                                    parameter={parameter}
                                    required
                                    validator={(s) => /^-?\d+$/.test(s)}
                />
            )
        case ScraperParameterType.Password:
            return (
                <ParameterPasswordField disabled={disabled}
                                        handleChange={handleChange}
                                        parameter={parameter}
                                        required
                                        validator={(s) => !!s}
                />
            )
        case ScraperParameterType.String:
            return (
                <ParameterTextField disabled={disabled}
                                    handleChange={handleChange}
                                    parameter={parameter}
                                    required
                                    validator={(s) => !!s}
                />
            )
        default:
            throw new Error(`Unsupported parameter type '${parameter.parameter.type}'`)
    }
}

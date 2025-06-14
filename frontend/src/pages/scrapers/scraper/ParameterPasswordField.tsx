import { IconButton, InputAdornment, TextField } from "@mui/material"
import { MouseEvent, useState } from "react"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { ScraperParameter } from "../../../graphql/graphql.ts"

export interface ParameterPasswordFieldProps {
    disabled?: boolean
    handleChange: (parameter: ScraperParameter, value: ScraperParameter["value"]) => void
    parameter: ScraperParameter,
    required?: boolean
    validator: (s: string) => boolean,
}

export function ParameterPasswordField(props: ParameterPasswordFieldProps) {
    const { disabled, handleChange, parameter, required, validator } = props
    const [ showPassword, setShowPassword ]                          = useState<boolean>(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

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
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            type={showPassword ? "text" : "password"}
            value={parameter.value}
        />
    )
}

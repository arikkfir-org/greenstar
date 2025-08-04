import { DateTime } from "luxon"

export abstract class BaseConfig {
    protected requireStringEnvVar(name: string) {
        const value = this.stringEnvVar(name)
        if (!value) {
            throw new Error(`Missing environment variable: ${name}`)
        }
        return value
    }

    protected stringEnvVar(name: string, defaultValue?: string) {
        return process.env[name] || defaultValue
    }

    protected requireDateTimeEnvVar(name: string) {
        const value = this.dateTimeEnvVar(name)
        if (!value) {
            throw new Error(`Missing environment variable: ${name}`)
        }
        return value
    }

    protected dateTimeEnvVar(name: string) {
        const value = process.env[name]
        if (!value) {
            return undefined
        } else {
            return DateTime.fromISO(value)
        }
    }

    protected booleanEnvVar(name: string, defaultValue?: boolean) {
        const value = process.env[name]
        if (!value) {
            return defaultValue
        } else {
            return [ "true", "t", "yes", "y", "ok" ].includes(value.toLowerCase())
        }
    }
}

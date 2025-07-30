function requireStringEnvVar(name: string) {
    const value = stringEnvVar(name)
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`)
    }
    return value
}

function stringEnvVar(name: string, defaultValue?: string) {
    return process.env[name] || defaultValue
}

export const config = {
    uploads: {
        path: requireStringEnvVar("DATA_PATH") + "/uploads",
    },
}

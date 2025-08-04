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
    gcp: {
        projectID: stringEnvVar("GCP_PROJECT_ID"),
        genai: {
            location: "global",
            classificationModel: 'gemini-2.5-flash',
        }
    },
    k8s: {
        namespace: requireStringEnvVar("POD_NAMESPACE"),
    },
    uploads: {
        path: requireStringEnvVar("DATA_PATH") + "/uploads",
    },
    scrapers: {
        image: {
            repository: requireStringEnvVar("SCRAPERS_IMAGE_NAME_REPOSITORY"),
            tag: requireStringEnvVar("SCRAPERS_IMAGE_NAME_TAG"),
            pullPolicy: requireStringEnvVar("SCRAPERS_IMAGE_NAME_PULL_POLICY"),
        },
        serviceAccountName: requireStringEnvVar("SCRAPERS_SERVICE_ACCOUNT_NAME"),
    }
}

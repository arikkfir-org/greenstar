import { BaseConfig } from "./base-config.ts"

class Config extends BaseConfig {

    public readonly tenantID: string

    public readonly scraperID: string

    constructor() {
        super()
        this.tenantID  = this.requireStringEnvVar("TENANT_ID")
        this.scraperID = this.requireStringEnvVar("SCRAPER_ID")
    }
}

export const generalConfig = new Config()

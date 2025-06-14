/**
 * Bank Yahav Configuration
 *
 * This module provides configuration management for the Bank Yahav scraper.
 * It loads required environment variables for authentication and identification.
 */

import { BaseConfig } from "../../util/base-config.ts"
import { generalConfig } from "../../util/general-config.ts"

/**
 * Configuration class for Bank Yahav scraper
 *
 * Loads and provides access to required configuration values from environment variables.
 * All configuration values are read-only and initialized during construction.
 */
class Config extends BaseConfig {
    /**
     * Bank account identifier in the system
     */
    public readonly accountID: string

    /**
     * Username for Bank Yahav authentication
     */
    public readonly username: string

    /**
     * Password for Bank Yahav authentication
     */
    public readonly password: string

    /**
     * PIN number for Bank Yahav authentication
     */
    public readonly pinno: string

    /**
     * Indicates whether to download transactions XLS (Excel Spreadsheet) files or not.
     */
    public readonly downloadXLS: boolean

    /**
     * Creates a new configuration instance
     *
     * Loads all required environment variables for Bank Yahav scraper.
     * Throws an error if any required environment variable is missing.
     */
    constructor() {
        super()

        this.accountID = this.requireStringEnvVar("PARAM_ACCOUNT_ID")
        console.info(`Scraping account ${this.accountID} in tenant ${generalConfig.tenantID}`)

        this.username = this.requireStringEnvVar("PARAM_BANK_YAHAV_USERNAME")
        this.password = this.requireStringEnvVar("PARAM_BANK_YAHAV_PASSWORD")
        this.pinno    = this.requireStringEnvVar("PARAM_BANK_YAHAV_PINNO")

        this.downloadXLS = this.booleanEnvVar("PARAM_DOWNLOAD_XLS") || false
        if (this.downloadXLS) {
            console.info(`Downloading XLS files is enabled`)
        } else {
            console.info(`Downloading XLS files is disabled`)
        }
    }
}

export const bankYahavConfig = new Config()

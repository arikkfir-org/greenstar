import * as fs from "fs"
import * as yaml from "js-yaml"
import { generateTenant } from "./tenant.js"
import { generateScraper } from "./scrapers.js"
import { generateAccount } from "./account.js"
import { generateAccountTransactions } from "./transactions.js"

export interface ACMEData {
    id: string
    displayName: string
    defaultCurrency: string
    scrapers: ACMEScraper[]
    accounts: ACMEAccount[]
}

export interface ACMEAccount {
    id: string
    displayName?: string
    icon: string
    children?: ACMEAccount[]
    outgoingTransactions?: ACMETransaction[]
}

export interface ACMETransaction {
    date?: string
    dateDelta?: string
    amount?: number
    amountDelta?: string | number
    currency?: string
    description?: string
    targetAccountID: string
    repeat?: number
}

export interface ACMEScraper {
    id: string
    displayName?: string
    type: string
    parameters?: {
        [key: string]: string
    }
}

async function main() {
    // Read all YAML files from /tenants directory
    const tenantFiles = fs.readdirSync("/tenants").filter(file => file.endsWith(".yaml"))

    if (tenantFiles.length === 0) {
        console.warn("No tenant YAML files found in /tenants directory")
        return
    }

    for (const tenantFile of tenantFiles) {
        console.info(`Processing tenant file: ${tenantFile}`)
        const tenantData = yaml.load(fs.readFileSync(`/tenants/${tenantFile}`, "utf8")) as ACMEData

        if (!tenantData.id || !tenantData.displayName) {
            console.warn(`Skipping tenant file ${tenantFile} - missing required id or displayName`)
            continue
        }

        console.info(`Creating tenant ${tenantData.id}...`)
        const builtinAccountIDs = await generateTenant(tenantData.id, tenantData.displayName)

        console.info(`Creating accounts for tenant ${tenantData.id}...`)
        for (let account of tenantData.accounts) {
            await generateAccount(tenantData.id, builtinAccountIDs, account)
        }

        console.info(`Creating account transactions for tenant ${tenantData.id}...`)
        if (tenantData.accounts && tenantData.accounts.length) {
            for (let account of tenantData.accounts) {
                await generateAccountTransactions(tenantData.id, tenantData.defaultCurrency, account)
            }
        }

        console.info(`Creating scrapers for tenant ${tenantData.id}...`)
        if (tenantData.scrapers && tenantData.scrapers.length) {
            for (let scraper of tenantData.scrapers) {
                await generateScraper(tenantData.id, scraper)
            }
        }

        console.info(`Finished processing tenant ${tenantData.id}`)
    }

    console.info(`All tenants processed successfully!`)
}

await main()

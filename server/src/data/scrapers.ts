import { PoolClient } from "pg"
import {
    MutationDeleteScraperArgs,
    MutationUpsertScraperArgs,
    Scraper,
    ScraperJob,
    ScraperJobStatus,
    ScraperParameter,
    ScraperParameterType,
    ScraperType,
    ScraperTypeParameter,
    Tenant,
} from "../schema/graphql.js"
import { convertObjectKeysToCamelCase } from "./pg_client.js"
import { DateTime, Duration } from "luxon"
import { config } from "../config.js"
import { ScraperRow } from "../resolvers.js"
import { ApiException, V1Job, V1JobSpec, V1Pod } from "@kubernetes/client-node"
import { batchAPI, coreAPI, deployment, podNamespace } from "../util/k8s_client.js"

export class ScrapersDataAccessLayer {
    constructor(private readonly pg: PoolClient) {
    }

    async upsertScraper(args: MutationUpsertScraperArgs): Promise<Scraper> {
        const { tenantID, id, displayName, scraperTypeID, parameters } = args

        const scraperType = await this.fetchScraperType(scraperTypeID)
        if (!scraperType) {
            throw new Error(`Could not find scraper type ${scraperTypeID}`)
        }

        const scraperTypeParameters: ScraperTypeParametersInDB = scraperType.parameters.reduce(
            (prev, curr) => ({ ...prev, [curr.id]: curr }),
            {},
        )

        const parametersForDB: ScraperParametersInDB = parameters.reduce(
            (prev, curr) => ({ ...prev, [curr.parameterID]: curr.value }),
            {} as ScraperParametersInDB,
        )
        for (let [ parameterID, value ] of Object.entries(parametersForDB)) {
            const parameterType = scraperTypeParameters[parameterID]
            if (!parameterType) {
                throw new Error(`Scraper type ${scraperTypeID} does not have parameter ${parameterID}`)
            }
            switch (parameterType.type) {
                case "Account":
                    break
                case "Boolean":
                    if (value != "true" && value != "false") {
                        throw new Error(`Invalid value for boolean parameter ${parameterID}: ${value}`)
                    }
                    break
                case "Date":
                    if (!DateTime.fromISO(value).isValid) {
                        throw new Error(`Invalid value for date parameter ${parameterID}: ${value}`)
                    }
                    break
                case "Float":
                    if (!/^-?\d+(\.\d+)?$/.test(value)) {
                        throw new Error(`Invalid value for floating point parameter ${parameterID}: ${value}`)
                    }
                    break
                case "Integer":
                    if (!/^-?\d+$/.test(value)) {
                        throw new Error(`Invalid value for integer parameter ${parameterID}: ${value}`)
                    }
                    break
                case "Password":
                    break
                case "String":
                    break
            }
        }

        // Save scraper with empty parameters
        const sqlParams = [ displayName, scraperTypeID, parametersForDB, tenantID ]
        if (id) {
            sqlParams.push(id)
        }
        const res = await this.pg.query(`
            INSERT INTO scrapers (display_name, scraper_type_id, parameters, tenant_id ${id ? ", id" : ""})
            VALUES ($1, $2, $3, $4 ${id ? ", $5" : ""})
            ON CONFLICT ON CONSTRAINT uq_scrapers DO UPDATE
                SET display_name    = $1,
                    scraper_type_id = $2,
                    parameters      = $3
            RETURNING id
        `, sqlParams)
        if (res.rowCount != 1 || res.rows.length != 1) {
            throw new Error(`Incorrect number of affected or rows returned: ${JSON.stringify(res)}`)
        }
        const scraperID = res.rows[0].id as string

        const scraper = await this.fetchScraper(tenantID, scraperID)
        if (!scraper) {
            throw new Error(`Could not find newly created scraper ${scraperID}`)
        }

        // Create or update the corresponding CronJob
        const cronJobName        = generateScraperCronJobName(tenantID, scraperID)
        const cronJobCoordinates = {
            namespace: podNamespace,
            name: cronJobName,
        }

        // Define the CronJob spec that will be used for both create and patch operations
        const cronJobSpec = {
            schedule: "0 2 * * *",
            suspend: true, // TODO: make suspension controllable (property of the scraper)
            concurrencyPolicy: "Forbid",
            failedJobsHistoryLimit: 2,
            successfulJobsHistoryLimit: 1,
            jobTemplate: {
                metadata: {
                    labels: scraperJobLabels(tenantID, scraperID, "scheduled"),
                },
                spec: createScraperJob(tenantID, scraper, "scheduled"),
            },
        }

        try {
            // Try to read the existing CronJob
            console.debug(`Checking if cron job ${cronJobName} exists`)
            await batchAPI.readNamespacedCronJob(cronJobCoordinates)

            // If we get here, the CronJob exists, so patch it
            console.debug(`Patching existing cron job ${cronJobName}`)
            await batchAPI.patchNamespacedCronJob({
                ...cronJobCoordinates,
                body: [ { op: "replace", path: "/spec", value: cronJobSpec } ],
            }, {})
        } catch (e) {
            // If the CronJob doesn't exist, create it
            if (e instanceof ApiException && e.code == 404) {
                console.debug(`Creating new cron job ${cronJobName}`)
                await batchAPI.createNamespacedCronJob({
                    namespace: podNamespace,
                    body: {
                        apiVersion: "batch/v1",
                        kind: "CronJob",
                        metadata: {
                            name: cronJobName,
                            labels: scraperJobLabels(tenantID, scraperID, "scheduled"),
                            ownerReferences: [
                                {
                                    apiVersion: "apps/v1",
                                    kind: "Deployment",
                                    name: deployment.metadata!.name!,
                                    uid: deployment.metadata!.uid!,
                                    controller: true,
                                },
                            ],
                        },
                        spec: cronJobSpec,
                    },
                })
            } else {
                throw e
            }
        }

        return (await this.fetchScraper(tenantID, scraperID))!
    }

    async deleteScraper(args: MutationDeleteScraperArgs): Promise<void> {
        const { tenantID, id } = args

        console.debug(`Deleting CronJob for scraper ${id} in tenant ${tenantID}`)
        const cronJobCoordinates = {
            namespace: podNamespace,
            name: generateScraperCronJobName(tenantID, id),
        }
        const pollStartTime      = DateTime.now()
        while (true) {

            // Check if it exists
            //      If not found, break (great)
            //      If found and not deleted yet - try to delete (but don't break the loop)
            try {
                const cronJob = await batchAPI.readNamespacedCronJob(cronJobCoordinates)
                if (!cronJob.metadata?.deletionTimestamp) {
                    console.info(`Deleting cron job ${cronJobCoordinates.name}`)
                    await batchAPI.deleteNamespacedCronJob(cronJobCoordinates)
                } else {
                    console.info(`Cron job ${cronJobCoordinates.name} is still being deleted`)
                }
            } catch (e) {
                if (e instanceof ApiException && e.code == 404) {
                    break
                } else {
                    throw e
                }
            }

            // If we're doing this for more than 2min, fail
            if (pollStartTime.diffNow("minutes").minutes > 2) {
                throw new Error(`Timeout waiting for cron job to be deleted`)
            }

            // Sleep a bit in prep for another retry
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        console.debug(`Deleting manual jobs for scraper ${id} in tenant ${tenantID}`)
        const manualJobs = await batchAPI.listNamespacedJob({
            namespace: podNamespace,
            labelSelector: scraperJobLabelSelector(tenantID, id, "manual"),
        })
        if (manualJobs.items.length) {
            for (let job of manualJobs.items) {
                console.info(`Deleting manual job ${job.metadata?.name}`)
                await batchAPI.deleteNamespacedJob({
                    namespace: podNamespace,
                    name: job.metadata?.name!,
                    body: {
                        propagationPolicy: "Foreground",
                    },
                })
            }
        }

        console.debug(`Deleting scraper ${id} in tenant ${tenantID}`)
        const res = await this.pg.query(`
            DELETE
            FROM scrapers
            WHERE tenant_id = $1 AND id = $2
        `, [ tenantID, id ])
        if (res.rowCount != 1) {
            throw new Error(`Incorrect number of rows affected: ${JSON.stringify(res)}`)
        }
    }

    async fetchScraperType(id: ScraperType["id"]): Promise<ScraperType | null> {
        const res = await this.pg.query(`
                    SELECT st.id,
                           st.created_at,
                           st.updated_at,
                           st.display_name,
                           st.parameters
                    FROM scraper_types AS st
                    WHERE id = $1
            `,
            [ id ])
        if (res.rows.length == 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows
                      .map(convertObjectKeysToCamelCase)
                      .map((r): ScraperType => ({
                          ...(r as ScraperType),
                          parameters: mapScraperTypeParameters(r.parameters),
                      }))[0]
        }
    }

    async fetchScraperTypes(): Promise<ScraperType[]> {
        const res = await this.pg.query(`
                    SELECT st.id,
                           st.created_at,
                           st.updated_at,
                           st.display_name,
                           st.parameters
                    FROM scraper_types AS st
                    ORDER BY st.display_name, st.id
            `,
            [])
        return res.rows
                  .map(convertObjectKeysToCamelCase)
                  .map((r): ScraperType => ({
                      ...(r as ScraperType),
                      parameters: mapScraperTypeParameters(r.parameters),
                  }))
    }

    async fetchScraper(tenantID: Tenant["id"], id: Scraper["id"]): Promise<Scraper | null> {
        const res = await this.pg.query(`
                    SELECT s.id                           AS s_id,
                           s.created_at                   AS s_created_at,
                           s.updated_at                   AS s_updated_at,
                           s.display_name                 AS s_display_name,
                           s.scraper_type_id              AS s_scraper_type_id,
                           s.parameters                   AS s_parameters,
                           s.last_successful_scraped_date AS s_last_successful_scraped_date,
                           s.tenant_id                    AS s_tenant_id,
                           t.created_at                   AS t_created_at,
                           t.updated_at                   AS t_updated_at,
                           t.display_name                 AS t_display_name,
                           st.id                          AS st_id,
                           st.created_at                  AS st_created_at,
                           st.updated_at                  AS st_updated_at,
                           st.display_name                AS st_display_name,
                           st.parameters                  AS st_parameters
                    FROM scrapers AS s
                             JOIN tenants AS t ON s.tenant_id = t.id
                             JOIN scraper_types AS st ON s.scraper_type_id = st.id
                    WHERE s.tenant_id = $1 AND s.id = $2
            `,
            [ tenantID, id ])
        if (res.rows.length == 0) {
            return null
        } else if (res.rows.length > 1) {
            throw new Error(`Too many rows returned: ${JSON.stringify(res)}`)
        } else {
            return res.rows.map(mapScraper)[0]
        }
    }

    async fetchScrapers(tenantID: Tenant["id"], scraperTypeID?: ScraperType["id"]): Promise<Scraper[]> {
        const res = await this.pg.query(`
                    SELECT s.id                           AS s_id,
                           s.created_at                   AS s_created_at,
                           s.updated_at                   AS s_updated_at,
                           s.display_name                 AS s_display_name,
                           s.last_successful_scraped_date AS s_last_successful_scraped_date,
                           s.scraper_type_id              AS s_scraper_type_id,
                           s.parameters                   AS s_parameters,
                           s.tenant_id                    AS s_tenant_id,
                           t.created_at                   AS t_created_at,
                           t.updated_at                   AS t_updated_at,
                           t.display_name                 AS t_display_name,
                           st.id                          AS st_id,
                           st.created_at                  AS st_created_at,
                           st.updated_at                  AS st_updated_at,
                           st.parameters                  AS st_parameters,
                           st.display_name                AS st_display_name
                    FROM scrapers AS s
                             JOIN tenants AS t ON s.tenant_id = t.id
                             JOIN scraper_types AS st ON s.scraper_type_id = st.id
                    WHERE TRUE
                      AND tenant_id = $1
                        ${scraperTypeID ? `AND scraper_type_id = $2` : ""}
                    ORDER BY s.display_name, st.display_name, s.id
            `,
            scraperTypeID ? [ tenantID, scraperTypeID ] : [ tenantID ])
        return res.rows.map(mapScraper)
    }

    async fetchScraperJob(tenantID: Tenant["id"], scraperJobID: ScraperJob["id"]): Promise<ScraperJob | null> {
        const job         = await batchAPI.readNamespacedJob({
            namespace: podNamespace,
            name: scraperJobID,
        })
        const jobTenantID = job.metadata?.labels!["greenstar.finance/tenant-id"]
        if (!jobTenantID || jobTenantID !== tenantID) {
            throw new Error(`Unexpected tenant ID in job ${scraperJobID}: ${jobTenantID} != ${tenantID}`)
        }
        const scraperID = job.metadata?.labels!["greenstar.finance/scraper-id"]
        if (!scraperID) {
            throw new Error(`No scraper ID in job ${scraperJobID}`)
        }
        const scraper = await this.fetchScraper(tenantID, scraperID)
        if (!scraper) {
            throw new Error(`Could not find scraper ${scraperID}`)
        }
        const scraperTypeParameters: { [p: string]: ScraperTypeParameter } = scraper.type.parameters.reduce(
            (prev, curr) => ({ ...prev, [curr.id]: curr }),
            {},
        )
        return mapScraperJob(scraper, scraperTypeParameters, job)
    }

    async fetchScraperJobs(tenantID: string, scraperID: string): Promise<ScraperJob[]> {
        const scraper = await this.fetchScraper(tenantID, scraperID)
        if (!scraper) {
            throw new Error(`Could not find scraper ${scraperID}`)
        }
        const scraperTypeParameters: { [p: string]: ScraperTypeParameter } = scraper.type.parameters.reduce(
            (prev, curr) => ({ ...prev, [curr.id]: curr }),
            {},
        )
        const jobs                                                         = await batchAPI.listNamespacedJob({
            namespace: podNamespace,
            labelSelector: scraperJobLabelSelector(tenantID, scraperID),
        })
        return jobs.items.map(job => mapScraperJob(scraper, scraperTypeParameters, job))
    }

    async fetchScraperJobLogs(
        tenantID: string,
        scraperJobID: string,
        page?: number,
        pageSize?: number): Promise<string[]> {

        const jobPods    = await coreAPI.listNamespacedPod({
            namespace: podNamespace,
            labelSelector: `greenstar.finance/tenant-id=${tenantID},job-name=${scraperJobID}`,
        })
        const sortedPods = jobPods.items.toSorted(comparePodCreationTimestamps)

        const allLogs: string[] = []
        for (let pod of sortedPods) {
            const podLogs = await coreAPI.readNamespacedPodLog({
                namespace: podNamespace,
                name: pod.metadata!.name!,
                timestamps: true,
            })

            allLogs.push(...podLogs.split("\n"))
            if (typeof page !== "undefined" && typeof pageSize !== "undefined") {
                if (allLogs.length >= page * pageSize + pageSize) {
                    break
                }
            }
        }

        if (typeof page !== "undefined" && typeof pageSize !== "undefined") {
            return allLogs.slice(page * pageSize, page * pageSize + pageSize)
        } else {
            return allLogs
        }
    }

    async triggerScraper(tenantID: Tenant["id"], scraperID: Scraper["id"]): Promise<ScraperJob> {
        const scraper = await this.fetchScraper(tenantID, scraperID)
        if (!scraper) {
            throw new Error(`Could not find scraper ${scraperID}`)
        }

        const cronJobName: string       = generateScraperCronJobName(tenantID, scraperID)
        const jobName: string           = `${cronJobName}-${DateTime.now().toUnixInteger()}`
        const jobSpec: V1JobSpec        = createScraperJob(tenantID, scraper, "manual")
        jobSpec.ttlSecondsAfterFinished = Duration.fromObject({ hours: 24 }).as("seconds")

        const job = await batchAPI.createNamespacedJob({
            namespace: podNamespace,
            body: {
                apiVersion: "batch/v1",
                kind: "Job",
                metadata: {
                    name: jobName,
                    namespace: podNamespace,
                    labels: scraperJobLabels(tenantID, scraperID, "manual"),
                    ownerReferences: [
                        {
                            apiVersion: "apps/v1",
                            kind: "Deployment",
                            name: deployment.metadata!.name!,
                            uid: deployment.metadata!.uid!,
                            controller: true,
                        },
                    ],
                },
                spec: jobSpec,
            },
        })

        return (await this.fetchScraperJob(tenantID, job.metadata?.name!))!
    }

    async setLastSuccessfulScrapedDate(
        tenantID: Tenant["id"],
        scraperID: Scraper["id"],
        date: DateTime): Promise<DateTime> {

        const res = await this.pg.query(`
            UPDATE scrapers
            SET last_successful_scraped_date = $3
            WHERE tenant_id = $1 AND id = $2
        `, [ tenantID, scraperID, date ])
        if (res.rowCount != 1) {
            throw new Error(`Incorrect number of rows affected: ${JSON.stringify(res)}`)
        }

        const scraper = await this.fetchScraper(tenantID, scraperID)
        return scraper!.lastSuccessfulScrapedDate!
    }
}

interface ScraperTypeParametersInDB {
    [k: string]: ScraperTypeParameterInDB
}

interface ScraperTypeParameterInDB {
    displayName: string,
    type: string,
    source: string,
}

interface ScraperParametersInDB {
    [k: string]: string
}

function generateScraperCronJobName(tenantID: string, scraperID: string) {
    return `scr-${tenantID}-${scraperID}`.toLowerCase()
}

function createScraperJob(tenantID: Tenant["id"], scraper: Scraper, trigger: "scheduled" | "manual"): V1JobSpec {
    return {
        // We don't want scraping retries, due to target rate limits, etc
        backoffLimit: 0,

        // Ensure the scraping does not go indefinitely
        activeDeadlineSeconds: Duration.fromObject({ minutes: 15 }).as("seconds"),


        template: {
            metadata: {
                labels: scraperJobLabels(tenantID, scraper.id, trigger),
            },
            spec: {
                enableServiceLinks: false,
                restartPolicy: "Never",
                containers: [
                    {
                        env: [
                            {
                                name: "POD_NAMESPACE",
                                valueFrom: {
                                    fieldRef: { fieldPath: "metadata.namespace" },
                                },
                            },
                            {
                                name: "POD_NAME",
                                valueFrom: {
                                    fieldRef: { fieldPath: "metadata.name" },
                                },
                            },
                            {
                                name: "JOB_NAME",
                                valueFrom: {
                                    fieldRef: { fieldPath: "metadata.labels['job-name']" },
                                },
                            },
                            { name: "NODE_ENV", value: process.env.NODE_ENV || "development" },
                            { name: "API_URL", value: "http://greenstar-server" },
                            { name: "GRAPHQL_API_URL", value: "http://greenstar-server/graphql" },
                            { name: "TENANT_ID", value: tenantID },
                            { name: "SCRAPER_ID", value: scraper.id },
                            { name: "SCRAPER_TYPE_ID", value: scraper.type.id },
                            ...scraper.parameters.map(
                                ({ parameter, value }) => ({
                                    name: `PARAM_${parameter.id}`,
                                    value,
                                }),
                            ),
                        ],
                        image: `${config.scrapers.image.repository}:${config.scrapers.image.tag}`,
                        imagePullPolicy: config.scrapers.image.pullPolicy,
                        name: "scraper",
                        resources: {
                            requests: {
                                cpu: "1000m",
                                memory: "1Gi",
                            },
                            limits: {
                                cpu: "2000m",
                                memory: "2Gi",
                            },
                        },
                    },
                ],
            },
        },
    }
}

function mapScraperTypeParameters(parameters: ScraperTypeParametersInDB): ScraperTypeParameter[] {
    return Object.entries(parameters)
                 .map(([ key, value ]) => mapScraperTypeParameter(key, value))
}

function mapScraperTypeParameter(id: string, p: ScraperTypeParameterInDB): ScraperTypeParameter {
    let type: ScraperParameterType
    if (p.type.toUpperCase() == ScraperParameterType.Account.toUpperCase()) {
        type = ScraperParameterType.Account
    } else if (p.type.toUpperCase() == ScraperParameterType.Boolean.toUpperCase()) {
        type = ScraperParameterType.Boolean
    } else if (p.type.toUpperCase() == ScraperParameterType.Date.toUpperCase()) {
        type = ScraperParameterType.Date
    } else if (p.type.toUpperCase() == ScraperParameterType.Float.toUpperCase()) {
        type = ScraperParameterType.Float
    } else if (p.type.toUpperCase() == ScraperParameterType.Integer.toUpperCase()) {
        type = ScraperParameterType.Integer
    } else if (p.type.toUpperCase() == ScraperParameterType.Password.toUpperCase()) {
        type = ScraperParameterType.Password
    } else if (p.type.toUpperCase() == ScraperParameterType.String.toUpperCase()) {
        type = ScraperParameterType.String
    } else {
        throw new Error(`Invalid scraper parameter type: ${p.type}`)
    }

    return { id, displayName: p.displayName, type }
}

function scraperJobLabels(tenantID: Tenant["id"], scraperID: Scraper["id"], trigger?: "scheduled" | "manual"): {
    [key: string]: string
} {
    const labels: { [key: string]: string } = {
        "greenstar.finance/tenant-id": tenantID,
        "greenstar.finance/scraper-id": scraperID,
    }
    if (trigger) {
        labels["greenstar.finance/trigger"] = trigger
    }
    return labels
}

function scraperJobLabelSelector(tenantID: Tenant["id"],
    scraperID: Scraper["id"],
    trigger?: "scheduled" | "manual"): string {
    return Object.entries(scraperJobLabels(tenantID, scraperID, trigger))
                 .map(([ key, value ]) => `${key}=${value}`)
                 .join(",")
}

function mapScraper(r: any): ScraperRow {
    const dbScraperTypeParameters: ScraperTypeParametersInDB = r.st_parameters
    const dbScraperParametersMap: ScraperParametersInDB      = r.s_parameters

    const scraperTypeParametersMap: { [k: string]: ScraperTypeParameter } =
              Object.entries(dbScraperTypeParameters)
                    .map(([ id, p ]) => mapScraperTypeParameter(id, p))
                    .reduce(
                        (prev: { [k: string]: ScraperTypeParameter }, curr) =>
                            ({ ...prev, [curr.id]: curr }),
                        {},
                    )

    const scraperParametersArray: ScraperParameter[] =
              Object.entries(dbScraperParametersMap).map(([ id, value ]) => {
                  if (dbScraperTypeParameters[id] === undefined) {
                      throw new Error(`Scraper parameter ${id} not found in scraper type parameters`)
                  }
                  return { parameter: scraperTypeParametersMap[id], value }
              })

    return {
        id: r.s_id,
        createdAt: r.s_created_at,
        updatedAt: r.s_updated_at,
        displayName: r.s_display_name,
        lastSuccessfulScrapedDate: r.s_last_successful_scraped_date,
        type: {
            id: r.st_id,
            createdAt: r.st_created_at,
            updatedAt: r.st_updated_at,
            displayName: r.st_display_name,
            parameters: mapScraperTypeParameters(r.st_parameters),
        },
        parameters: scraperParametersArray,
        tenantID: r.s_tenant_id,
        tenant: {
            id: r.s_tenant_id,
            createdAt: r.t_created_at,
            updatedAt: r.t_updated_at,
            displayName: r.t_display_name,
        },
        scraperTypeID: r.s_scraper_type_id,
    } as ScraperRow
}

function mapScraperJob(scraper: Scraper,
    scraperTypeParameters: { [p: string]: ScraperTypeParameter },
    job: V1Job): ScraperJob {
    const jobEnvVars = job.spec?.template!.spec!.containers[0].env!
    return {
        id: job.metadata!.name!,
        createdAt: DateTime.fromJSDate(job.metadata!.creationTimestamp!),
        scraper,
        status: getScraperJobStatus(job),
        parameters: jobEnvVars
            .filter(e => e.name.startsWith("PARAM_"))
            .map(e => {
                const fixedParamName = e.name.substring("PARAM_".length)
                const parameter      = scraperTypeParameters[fixedParamName]
                if (!parameter) {
                    throw new Error(`Scraper parameter ${fixedParamName} not found in scraper type parameters`)
                }
                return {
                    parameter,
                    value: e.value!,
                }
            }) || [],
    } as ScraperJob
}

function getScraperJobStatus(job: V1Job): ScraperJobStatus {
    if (job.status) {
        if (job.status.conditions) {
            for (const condition of job.status.conditions) {
                // Job has failed permanently
                if (condition.type === "Failed" && condition.status === "True") {
                    return ScraperJobStatus.Failed
                }

                // Job has completed successfully
                if (condition.type === "Complete" && condition.status === "True") {
                    return ScraperJobStatus.Successful
                }
            }
        }

        // Check numeric status indicators
        const completions           = job.spec!.completions || 1
        const succeeded             = job.status.succeeded || 0
        const failed                = job.status.failed || 0
        const active                = job.status.active || 0
        const backoffLimit          = job.spec!.backoffLimit || 6
        const activeDeadlineSeconds = job.spec!.activeDeadlineSeconds

        // Job has succeeded if we have enough successful completions
        if (succeeded >= completions) {
            return ScraperJobStatus.Successful
        }

        // Job has failed if we've exceeded the backoff limit
        if (failed > backoffLimit) {
            return ScraperJobStatus.Failed
        }

        // Job has failed if we have failures and no active pods and haven't succeeded
        if (failed > 0 && active === 0 && succeeded < completions) {
            // Check if we've hit the deadline
            if (activeDeadlineSeconds && job.status.startTime) {
                const elapsedSeconds = DateTime.fromJSDate(job.status.startTime).diffNow("seconds").seconds
                if (elapsedSeconds > activeDeadlineSeconds) {
                    return ScraperJobStatus.Failed
                }
            }
            return ScraperJobStatus.Pending
        }

        // Job is running if there are active pods
        if (active > 0) {
            return ScraperJobStatus.Running
        }

        // Job is pending if it has a start time but no active/succeeded/failed pods yet
        if (job.status.startTime && succeeded === 0 && failed === 0 && active === 0) {
            return ScraperJobStatus.Pending
        }

        // Job is pending if it hasn't started yet (no start time)
        if (!job.status.startTime) {
            return ScraperJobStatus.Pending
        }
    }

    // Default fallback - if we can't determine state clearly, assume pending
    return ScraperJobStatus.Pending
}

function comparePodCreationTimestamps(a: V1Pod, b: V1Pod): number {
    return a.metadata!.creationTimestamp!.getMilliseconds() - b.metadata!.creationTimestamp!.getMilliseconds()
}

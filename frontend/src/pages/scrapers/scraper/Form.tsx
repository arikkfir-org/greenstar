import { TypeSelectField } from "./TypeSelectField.tsx"
import { DisplayNameField } from "./DisplayNameField.tsx"
import { Button, SelectChangeEvent } from "@mui/material"
import { FormEvent, useCallback, useMemo, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { dismissAction } from "../../../util/notistack-actions.tsx"
import {
    Scraper,
    ScraperParameter,
    ScraperParameterType,
    ScraperType,
    ScraperTypeParameter,
    Tenant,
} from "../../../graphql/graphql.ts"
import {
    AccountsForScraperAccountParameter as Accounts,
    ScraperRow,
    ScraperTypes,
    UpsertScraper,
} from "../ScrapersQueries.ts"
import "./Form.scss"
import { useMutation, useQuery } from "@apollo/client"
import { useTenantID } from "../../../hooks/tenant.ts"
import { isEqual } from "lodash"
import { ParameterField } from "./ParameterField.tsx"
import { DateTime } from "luxon"

type ScraperTypeParameters = { [p: ScraperType["id"]]: ScraperType["parameters"] }

export interface FormProps {
    onSave: (scraper: ScraperRow) => void
    scraperID?: Scraper["id"],
    displayName?: string,
    scraperTypeID?: string,
    parameters?: ScraperParameter[],
}

export function Form({
    onSave,
    scraperID,
    displayName: originalDisplayName,
    scraperTypeID: originalScraperTypeID,
    parameters: originalParameters,
}: FormProps) {

    const tenantID: Tenant["id"]                    = useTenantID()
    const [ scraperTypeID, setScraperTypeID ]       = useState<string | undefined>(originalScraperTypeID)
    const [ displayName, setDisplayName ]           = useState<string | undefined>(originalDisplayName)
    const [ parameters, setParameters ]             = useState<ScraperParameter[] | undefined>(originalParameters)
    const [ upsertScraper, { loading: upserting } ] = useMutation(UpsertScraper)

    const { data: scraperTypes, loading: loadingTypes } = useQuery(ScraperTypes)
    const { data: accounts, loading: loadingAccounts }  = useQuery(Accounts, { variables: { tenantID } })

    const scraperTypeParametersByID: ScraperTypeParameters = useMemo(
        () => (scraperTypes?.scraperTypes?.reduce(
            (prev, curr) => ({ ...prev, [curr.id]: curr.parameters }),
            {},
        ) || {}),
        [ scraperTypes?.scraperTypes ],
    )

    const loading = loadingTypes || loadingAccounts

    const modified =
              !isEqual(displayName, originalDisplayName) ||
              !isEqual(scraperTypeID, originalScraperTypeID) ||
              !isEqual(parameters, originalParameters)

    const isValid =
              displayName &&
              scraperTypeID &&
              parameters && parameters.every(p => !!p.value)

    const handleScraperTypeChange = useCallback(
        (e: SelectChangeEvent<ScraperType["id"]>) => {
            setScraperTypeID(e.target.value)
            setParameters(
                scraperTypeParametersByID[e.target.value]!.map(
                    (stp: ScraperTypeParameter): ScraperParameter =>
                        (parameters && parameters.find((sp: ScraperParameter) => sp.parameter.id === stp.id))
                        ||
                        { parameter: stp, value: generateDefaultValueForScraperParameterType(stp.type) },
                ))
        },
        [ scraperTypeParametersByID, parameters ],
    )

    const handleValueChange = useCallback(
        (p: ScraperParameter, value: string): void => setParameters(
            (prev: ScraperParameter[] | undefined): ScraperParameter[] => (
                !prev
                    ? [ { parameter: p.parameter, value: value } ]
                    : prev.map(old => old.parameter.id === p.parameter.id ? { ...old, value } : old)
            ),
        ),
        [],
    )

    const handleSubmit = useCallback(
        async (event: FormEvent) => {
            event.preventDefault()
            if (!loading && !upserting && isValid) {
                const result = await upsertScraper({
                    variables: {
                        tenantID,
                        scraperID,
                        displayName,
                        scraperTypeID: scraperTypeID!,
                        parameters: parameters.map(p => ({ parameterID: p.parameter.id, value: p.value })),
                    },
                })
                if (!result.errors?.length && result.data?.upsertScraper) {
                    enqueueSnackbar(`Scraper saved successfully`, { action: dismissAction })
                    onSave(result.data!.upsertScraper)
                }
            }
        },
        [
            loading,
            upserting,
            isValid,
            upsertScraper,
            tenantID,
            scraperID,
            displayName,
            scraperTypeID,
            parameters,
            onSave,
        ],
    )

    return (
        <form onSubmit={handleSubmit}>
            <TypeSelectField disabled={loading || upserting}
                             handleChange={handleScraperTypeChange}
                             scraperTypes={scraperTypes?.scraperTypes || []}
                             value={scraperTypeID}
            />
            <DisplayNameField handleChange={setDisplayName} loading={loading || upserting} value={displayName} />
            {parameters && parameters.map((p) => (
                <ParameterField accounts={accounts?.tenant?.accounts}
                                key={p.parameter.id}
                                handleChange={handleValueChange}
                                loading={loading || upserting}
                                parameter={p} />
            ))}
            <Button type="submit"
                    loading={loading || upserting}
                    variant="contained"
                    fullWidth
                    disabled={loading || upserting || !isValid || !modified}>Save</Button>
        </form>
    )
}

function generateDefaultValueForScraperParameterType(type: ScraperTypeParameter["type"]): string {
    switch (type) {
        case ScraperParameterType.Account:
            return "unknown"
        case ScraperParameterType.Boolean:
            return "false"
        case ScraperParameterType.Date:
            return DateTime.now().toFormat("yyyy-MM-dd")
        case ScraperParameterType.Float:
            return "0"
        case ScraperParameterType.Integer:
            return "0"
        case ScraperParameterType.Password:
        case ScraperParameterType.String:
            return ""
        default:
            throw new Error(`Unsupported parameter type '${type}'`)
    }
}
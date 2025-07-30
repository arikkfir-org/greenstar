import { DateTime, Duration } from "luxon"
import { graphQLClient } from "./graphql-client.js"
import { gql } from "./graphql/gql.js"

// Default start date if not provided
const DEFAULT_START_DATE = "2020-01-01"
const startDate          =
          process.env.START_DATE
              ? DateTime.fromISO(process.env.START_DATE).startOf("day")
              : process.env.START_DATE_DURATION
                  ? DateTime.now().minus(Duration.fromISO(process.env.START_DATE_DURATION)).startOf("day")
                  : DateTime.fromISO(DEFAULT_START_DATE).startOf("day")

// Get yesterday's date in YYYY-MM-DD format
const yesterday = DateTime.now().minus({ days: 1 }).startOf("day")

// GraphQL queries and mutations
const GET_CURRENCIES = gql(`
    query GetCurrencies {
        currencies {
            code
        }
    }
`)

const GET_CURRENCY_RATES = gql(`
    query GetCurrencyRates($startDate: DateTime, $endDate: DateTime, $sourceCurrencyCode: String, $targetCurrencyCode: String) {
        currencyRates(
            startDate: $startDate,
            endDate: $endDate,
            sourceCurrencyCode: $sourceCurrencyCode,
            targetCurrencyCode: $targetCurrencyCode
        ) {
            date
            sourceCurrency {
                code
            }
            targetCurrency {
                code
            }
            rate
        }
    }
`)

const CREATE_CURRENCY_RATE = gql(`
    mutation CreateCurrencyRate($date: DateTime!, $sourceCurrencyCode: String!, $targetCurrencyCode: String!, $rate: Float!) {
        createCurrencyRate(
            date: $date,
            sourceCurrencyCode: $sourceCurrencyCode,
            targetCurrencyCode: $targetCurrencyCode,
            rate: $rate
        ) {
            date
            sourceCurrency {
                code
            }
            targetCurrency {
                code
            }
            rate
        }
    }
`)

// Interface for Frankfurter API responses
interface FrankfurterRatesResponse {
    base: string;
    start_date?: string;
    end_date?: string;
    rates: {
        [date: string]: {
            [currency: string]: number;
        };
    };
}

// Main function
async function main() {
    console.log("Starting currency rates job...")

    // Fetch supported currencies
    const supportedCurrencies = await fetchSupportedCurrencies()
    console.log(`Supported currencies: ${supportedCurrencies.join(", ")}`)

    // Fetch all currencies from the database
    const { data: currenciesData, error: currenciesError } = await graphQLClient.query(GET_CURRENCIES, {}).toPromise()
    if (currenciesError) {
        throw currenciesError
    } else if (!currenciesData) {
        throw new Error("No currencies found in database")
    }
    const dbCurrencies = currenciesData.currencies.map((c: { code: string }) => c.code)

    // Filter out currencies that are not supported by Frankfurter
    const validCurrencies = supportedCurrencies.filter(code => dbCurrencies.includes(code))
    console.log(`Valid currencies: ${validCurrencies.join(", ")}`)

    // Fetch historical rates from Frankfurter API
    console.log(`Fetching historical rates from ${startDate} to ${yesterday}...`)
    const historicalRatesResponse                       = await fetch(
        `https://api.frankfurter.dev/v1/${startDate.toFormat("yyyy-MM-dd")}..${yesterday.toFormat("yyyy-MM-dd")}?base=USD&symbols=${validCurrencies.join(
            ",")}`,
    )
    const historicalRatesData: FrankfurterRatesResponse = (await historicalRatesResponse.json()) as FrankfurterRatesResponse
    if (!historicalRatesData.rates) {
        console.debug("Response: ", historicalRatesData)
        throw new Error("No rates found in response")
    }

    // Process historical rates
    console.log("Processing historical rates...")
    await processRates(historicalRatesData, false)

    // Fetch current rates from Frankfurter API
    console.log(`Fetching current rates from ${yesterday}...`)
    const currentRatesResponse                       = await fetch(
        `https://api.frankfurter.dev/v1/${yesterday.toFormat("yyyy-MM-dd")}..?base=USD&symbols=${validCurrencies.join(
            ",")}`,
    )
    const currentRatesData: FrankfurterRatesResponse = (await currentRatesResponse.json()) as FrankfurterRatesResponse
    if (!currentRatesData.rates) {
        console.debug("Response: ", currentRatesData)
        throw new Error("No rates found in response")
    }

    // Process current rates
    console.log("Processing current rates...")
    await processRates(currentRatesData, true)

    // Fill in missing dates (non-commerce days)
    console.log("Filling in missing dates...")
    await fillMissingDates(startDate, yesterday, validCurrencies)

    // Create same-currency rates
    console.log("Creating same-currency rates...")
    await createSameCurrencyRates(startDate, validCurrencies)

    console.log("Currency rates job completed successfully.")
}

async function fetchSupportedCurrencies(): Promise<string[]> {
    if (process.env.SUPPORTED_CURRENCIES) {
        return process.env.SUPPORTED_CURRENCIES.split(",")
    }

    interface FrankfurterCurrencies {
        [key: string]: string
    }

    const response   = await fetch("https://api.frankfurter.dev/v1/currencies")
    const json       = await response.json()
    const currencies = json as FrankfurterCurrencies
    return Object.keys(currencies)
}

// Process rates from Frankfurter API
async function processRates(data: FrankfurterRatesResponse, isCurrentRates: boolean) {
    const sourceCurrency = "USD"
    for (const [ dateStr, currencies ] of Object.entries(data.rates)) {
        for (const [ targetCurrency, rate ] of Object.entries(currencies)) {
            const date = DateTime.fromISO(dateStr)

            // Skip if source and target are the same
            if (sourceCurrency === targetCurrency) {
                continue
            }

            // Create direct rate (USD to target)
            await createRate(date, sourceCurrency, targetCurrency, rate, isCurrentRates)

            // Create inverse rate (target to USD)
            await createRate(date, targetCurrency, sourceCurrency, 1 / rate, isCurrentRates)
        }
    }
}

// Create a currency rate
async function createRate(
    date: DateTime,
    sourceCurrency: string,
    targetCurrency: string,
    rate: number,
    forceUpdate: boolean,
) {

    // Check if rate already exists
    const { data: existingRates } = await graphQLClient.query(GET_CURRENCY_RATES, {
        startDate: date,
        endDate: date,
        sourceCurrencyCode: sourceCurrency,
        targetCurrencyCode: targetCurrency,
    }).toPromise()
    if (!existingRates) {
        throw new Error("Empty currency rates response received!")
    }

    // If rate exists and we're not forcing an update, skip
    if (existingRates.currencyRates.length > 0 && !forceUpdate) {
        return
    }

    // Create or update the rate
    await graphQLClient.mutation(CREATE_CURRENCY_RATE, {
        date: date,
        sourceCurrencyCode: sourceCurrency,
        targetCurrencyCode: targetCurrency,
        rate,
    }).toPromise()
}

// Fill in missing dates (non-commerce days)
async function fillMissingDates(start: DateTime, endDate: DateTime, currencies: string[]) {
    const sourceCurrency = "USD"

    // Generate all dates between start and end
    const allDates: DateTime[] = []
    let currentDate            = start
    while (currentDate.diff(endDate, "days").days <= 0) {
        allDates.push(currentDate)
        currentDate = currentDate.plus({ days: 1 })
    }

    for (const targetCurrency of currencies) {
        if (targetCurrency === sourceCurrency) {
            continue
        }

        // Get existing rates for this currency pair
        const { data: existingRatesData } = await graphQLClient.query(GET_CURRENCY_RATES, {
            startDate: start,
            endDate: endDate,
            sourceCurrencyCode: sourceCurrency,
            targetCurrencyCode: targetCurrency,
        }).toPromise()
        if (!existingRatesData) {
            throw new Error("Empty currency rates response received!")
        }

        const existingRates = existingRatesData.currencyRates
        const existingDates = new Set<DateTime>(existingRates.map(({ date }) => date))

        // Find missing dates
        for (const date of allDates.filter(d => !existingDates.has(d))) {
            // Find the most recent rate before this date
            const previousRates =
                      existingRates.filter(r => date.diff(r.date, "days").days > 0)
                                   .sort((a, b) => b.date.toMillis() - a.date.toMillis())

            if (previousRates.length > 0) {
                const mostRecentRate = previousRates[0].rate

                // Create rate using the most recent rate
                await createRate(date, sourceCurrency, targetCurrency, mostRecentRate, false)
                await createRate(date, targetCurrency, sourceCurrency, 1 / mostRecentRate, false)
            }
        }
    }
}

// Create same-currency rates (rate of 1.0)
async function createSameCurrencyRates(startDate: DateTime, currencies: string[]) {
    const start = startDate
    const end   = DateTime.now()

    // Generate all dates between start and end
    const allDates: DateTime[] = []
    let currentDate: DateTime  = start
    while (currentDate <= end) {
        allDates.push(currentDate)
        currentDate = currentDate.plus({ days: 1 })
    }

    for (const currency of currencies) {
        for (const date of allDates) {
            await createRate(date, currency, currency, 1.0, false)
        }
    }
}

// Run the main function
await main()

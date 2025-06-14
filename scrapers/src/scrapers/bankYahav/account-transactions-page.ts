import { DatePicker } from "./date-picker.ts"
import { expect, Locator, Page } from "@playwright/test"
import { AccountTransaction } from "./account-transaction.ts"
import { DateTime } from "luxon"

/**
 * Represents the account transactions page in the Bank Yahav website.
 *
 * This class provides methods to navigate through transaction history,
 * download transaction data, and extract transaction information from the page.
 */
export class AccountTransactionsPage {
    /** Date picker for the from/start date */
    public readonly fromDate: DatePicker

    /** Date picker for the to/end date */
    public readonly toDate: DatePicker

    /** Locator for the transaction rows in the table */
    private readonly transactionRowsLocator: Locator

    /** Locator for the Excel download icon */
    private readonly xlsDownloadIconLocator: Locator

    private readonly spinnerLocator: Locator

    /**
     * Creates a new AccountTransactionsPage instance
     *
     * @param {Page} page - The Playwright page object
     * @param {string} tenantID - The tenant ID for the current session
     * @param {string} accountID - The account ID for the current session
     */
    constructor(
        public readonly page: Page,
        public readonly tenantID: string,
        public readonly accountID: string,
    ) {
        this.fromDate               = new DatePicker(this.page, "datePickerPositionFrom")
        this.toDate                 = new DatePicker(this.page, "datePickerPositionTo")
        this.transactionRowsLocator = page.locator(`div.transactions > div.transactionList > div.list-item-holder > div[role=row] > div.row`)
        this.xlsDownloadIconLocator = page.locator(`div.export-options-lft-content > div.export-options-cell > a > i.icon.xls`)
        this.spinnerLocator         = page.locator(`div.loading-bar-spinner`)
    }

    /**
     * Waits until the page is fully loaded and visible
     *
     * Uses the Excel download icon as an indicator that the page has loaded
     */
    async awaitUntilVisible() {
        await expect(this.xlsDownloadIconLocator).toBeVisible()
        await this.page.waitForLoadState("networkidle")
        await expect(this.spinnerLocator).toHaveCount(0)
    }

    async setDateRange(startDate: DateTime, endDate: DateTime) {
        console.debug(`Adjusting the date range to '${startDate.toFormat("yyyy-MM-dd")} - ${endDate.toFormat("yyyy-MM-dd")}`)
        await this.fromDate.setDate(startDate.year, startDate.month, startDate.day)
        await this.toDate.setDate(endDate.year, endDate.month, endDate.day)
        await this.page.waitForLoadState("networkidle")
        await expect(this.spinnerLocator).toHaveCount(0)
    }

    /**
     * Moves both date pickers to the earliest possible date range
     *
     * Navigates to the earliest available month in both date pickers,
     * selecting the first day of the month for the from date and
     * the last day of the month for the to date.
     */
    async moveBackAsMuchAsPossible() {
        // Go back as much as possible in the start-date picker and select the first eligible day in that month
        await this.fromDate.open()
        while (await this.fromDate.hasPrevMonth()) {
            await this.fromDate.navigateToPreviousMonth()
        }
        await this.fromDate.selectFirstDayOfMonth()

        // Go back as much as possible in the to-date picker and select the last eligible day in that month
        await this.toDate.open()
        while (await this.toDate.hasPrevMonth()) {
            await this.toDate.navigateToPreviousMonth()
        }
        await this.toDate.selectLastDayOfMonth()
    }

    /**
     * Moves both date pickers forward by one month
     *
     * First moves the "to" date picker forward, then the "from" date picker.
     * This order is important to ensure the date range remains valid.
     *
     * @returns {Promise<boolean>} True if successfully moved forward, false if at the latest available month
     */
    async moveForwardOneMonth(): Promise<boolean> {
        await this.toDate.open()
        if (await this.toDate.hasNextMonth()) {

            await this.toDate.navigateToNextMonth()
            await this.toDate.selectLastDayOfMonth()

        } else {
            await this.toDate.close()
            return false
        }

        // Move the from date forward one month
        await this.fromDate.open()
        await this.fromDate.navigateToNextMonth()
        await this.fromDate.selectFirstDayOfMonth()

        // Wait until spinner goes away
        await this.page.waitForLoadState("networkidle")
        await expect(this.spinnerLocator).toHaveCount(0)
        return true
    }

    async hoverXLSDownloadButton() {
        await this.xlsDownloadIconLocator.hover()
    }

    /**
     * Downloads the transactions for the current date range as an Excel file
     *
     * Creates a filename based on the current date range and saves the downloaded file.
     */
    async downloadTransactionsExcel() {
        console.debug("Downloading transactions as Excel file...")

        const from     = (await this.fromDate.getDate()).toFormat("yyyy-MM-dd")
        const to       = (await this.toDate.getDate()).toFormat("yyyy-MM-dd")
        const filename = `./account-transactions-${from}-${to}.xls`

        const xlsDownloadPromise = this.page.waitForEvent("download")
        await this.xlsDownloadIconLocator.click()
        const xlsDownload = await xlsDownloadPromise
        await xlsDownload.saveAs(filename)
    }

    /**
     * Gets all transactions displayed on the current page
     *
     * Creates AccountTransaction objects for each row in the transactions table.
     *
     * @returns {Promise<AccountTransaction[]>} Array of account transactions
     */
    async getTransactions(): Promise<AccountTransaction[]> {
        console.debug("Fetching transactions from the transactions page...")

        const rowLocators: Locator[]             = await this.transactionRowsLocator.all()
        const transactions: AccountTransaction[] = []
        for (let i = rowLocators.length - 1; i >= 0; i--) {
            const rowLocator = rowLocators[i]
            const tx         = new AccountTransaction(this, rowLocator)
            await tx.init()
            transactions.push(tx)
        }

        console.debug(`Found ${transactions.length} transactions.`)
        return transactions
    }
}
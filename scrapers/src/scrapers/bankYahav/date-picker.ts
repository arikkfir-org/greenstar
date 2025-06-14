/**
 * Date Picker Component
 *
 * This module provides a wrapper for interacting with the date picker component
 * on the Bank Yahav website. It allows for navigation between months and selection
 * of specific dates within the calendar interface.
 */

import { expect, Locator, Page } from "@playwright/test"
import { DateTime } from "luxon"
import { hasClass } from "../../util/css.ts"

/**
 * DatePicker class for interacting with calendar components
 *
 * Provides methods to navigate through months, select dates, and interact
 * with the date picker component on the Bank Yahav website.
 */
export class DatePicker {
    /**
     * Main locator for the date picker component
     */
    private readonly locator: Locator

    /**
     * Locator for the input field of the date picker
     */
    private readonly inputLocator: Locator

    /**
     * Locator for the pickmeup container
     */
    private readonly pmuLocator: Locator

    /**
     * Locator for the pickmeup instance
     */
    private readonly pmuInstanceLocator: Locator

    /**
     * Locator for the previous month button
     */
    private readonly pmuPrevButtonLocator: Locator

    /**
     * Locator for the month selection button
     */
    private readonly pmuMonthButtonLocator: Locator

    /**
     * Locator for the next month button
     */
    private readonly pmuNextButtonLocator: Locator

    /**
     * Locator for the days container
     */
    private readonly pmuYearsLocator: Locator

    /**
     * Locator for the days container
     */
    private readonly pmuMonthsLocator: Locator

    /**
     * Locator for the days container
     */
    private readonly pmuDaysLocator: Locator

    /**
     * Creates a new DatePicker instance
     *
     * @param {Page} page - The Playwright page object
     * @param {string} name - The name identifier for the date picker component
     */
    constructor(private readonly page: Page, name: string) {
        this.locator               = page.locator(`div.date-options-cell > date-picker[calendar-position="currentAccount.${name}"]`)
        this.inputLocator          = this.locator.locator(`> div.date-picker-box > input`)
        this.pmuLocator            = this.locator.locator(`> div.pickmeup`)
        this.pmuInstanceLocator    = this.pmuLocator.locator(`> div.pmu-instance`)
        this.pmuPrevButtonLocator  = this.pmuInstanceLocator.locator(`> nav > div.pmu-prev`)
        this.pmuMonthButtonLocator = this.pmuInstanceLocator.locator(`> nav > div.pmu-month`)
        this.pmuNextButtonLocator  = this.pmuInstanceLocator.locator(`> nav > div.pmu-next`)
        this.pmuYearsLocator       = this.pmuInstanceLocator.locator(`> div.pmu-years`)
        this.pmuMonthsLocator      = this.pmuInstanceLocator.locator(`> div.pmu-months`)
        this.pmuDaysLocator        = this.pmuInstanceLocator.locator(`> div.pmu-days`)
    }

    async hover() {
        await this.inputLocator.hover()
    }

    /**
     * Gets the current date value from the input field
     *
     * @returns {Promise<DateTime>} The current date value
     */
    async getDate(): Promise<DateTime> {
        return DateTime.fromFormat(await this.inputLocator.inputValue(), "dd/MM/yyyy", { zone: "Asia/Jerusalem" })
    }

    /**
     * Opens the date picker calendar
     *
     * Clicks on the input field and waits for the calendar to become visible
     */
    async open() {
        await this.inputLocator.click()
        await expect(this.pmuDaysLocator).toBeVisible()
    }

    /**
     * Closes the date picker calendar
     *
     * Presses the Escape key to close the calendar
     */
    async close() {
        await this.pmuInstanceLocator.press("Escape")
    }

    async isValidPeriod(year: number, month: number) {
        // The date picker is lazily creating its internal data structures in the DOM
        // Thus we must perform the check while it is open
        await this.open()

        // Click the month selector to enter the month selection
        await this.pmuMonthButtonLocator.click()
        await expect(this.pmuMonthsLocator).toBeVisible()

        // Click the month selector again, to show the year selector
        await this.pmuMonthButtonLocator.click()
        await expect(this.pmuYearsLocator).toBeVisible()

        // Check if the given year is enabled
        const yearLocator = this.pmuYearsLocator.locator(`> div.pmu-button:not(.pmu-disabled):has-text("${year}")`)
        if (await yearLocator.count() === 0) {
            return false
        }

        // Click the year, and move forward to checking the month
        await yearLocator.click()
        await expect(this.pmuMonthsLocator).toBeVisible()

        // Check if the given month is enabled
        const monthLocator = this.pmuMonthsLocator.locator(`> div.pmu-button:nth-child(${month}):not(.pmu-disabled)`)
        if (await monthLocator.count() === 0) {
            return false
        }

        // Close the date picker
        await this.close()
        return true
    }

    /**
     * Navigates to the previous month in the calendar
     *
     * Clicks the previous month button and waits for the UI to update
     */
    async setDate(year: number, month: number, day: number) {
        await this.open()

        // Click the month selector to enter the month selection
        await this.pmuMonthButtonLocator.click()
        await expect(this.pmuMonthsLocator).toBeVisible()

        // Click the month selector again, to show the year selector
        await this.pmuMonthButtonLocator.click()
        await expect(this.pmuYearsLocator).toBeVisible()

        // Click the correct year
        const yearLocator = this.pmuYearsLocator.locator(`> div.pmu-button:text-is("${year}")`)
        await expect(yearLocator).toBeVisible()
        if (await hasClass(yearLocator, "pmu-disabled")) {
            throw new Error(`Year ${year} is not available for selection`)
        }
        await yearLocator.click()

        // Click the requested month
        await expect(this.pmuMonthsLocator).toBeVisible()
        const monthLocator = this.pmuMonthsLocator.locator(`> div.pmu-button`).nth(month - 1)
        if (await hasClass(monthLocator, "pmu-disabled")) {
            throw new Error(`Month ${month} is not available for selection in year ${year}`)
        }
        await monthLocator.click()

        // Expect the day selector to be shown
        await expect(this.pmuDaysLocator).toBeVisible()
        const dayLocator = this.pmuDaysLocator.locator(`> div.pmu-button:not(.pmu-not-in-month)`).nth(day - 1)
        await expect(dayLocator).toBeVisible()
        if (await hasClass(dayLocator, "pmu-disabled")) {
            throw new Error(`Day ${day} is not available for selection in month ${month} of year ${year}`)
        }
        await dayLocator.click()
    }

    /**
     * Navigates to the previous month in the calendar
     *
     * Clicks the previous month button and waits for the UI to update
     */
    async navigateToPreviousMonth() {
        await this.pmuPrevButtonLocator.click()
        await this.page.waitForTimeout(300)
    }

    /**
     * Navigates to the next month in the calendar
     *
     * Clicks the next month button and waits for the UI to update
     */
    async navigateToNextMonth() {
        await this.pmuNextButtonLocator.click()
        await this.page.waitForTimeout(300)
    }

    /**
     * Checks if navigation to the next month is possible
     *
     * @returns {Promise<boolean>} True if the next month button is visible
     */
    async hasNextMonth(): Promise<boolean> {
        return this.pmuNextButtonLocator.isVisible()
    }

    /**
     * Checks if navigation to the previous month is possible
     *
     * @returns {Promise<boolean>} True if the previous month button is visible
     */
    async hasPrevMonth(): Promise<boolean> {
        return this.pmuPrevButtonLocator.isVisible()
    }

    /**
     * Selects the first eligible day of the current month
     *
     * Finds and clicks on the first day that is not disabled and belongs to the current month
     */
    async selectFirstDayOfMonth() {
        const firstEligibleDay = this.pmuDaysLocator.locator(`> div.pmu-button:not(.pmu-disabled):not(.pmu-not-in-month)`)
                                     .first()
        await expect(firstEligibleDay).toBeVisible()
        await firstEligibleDay.click()
        await this.page.waitForTimeout(300)
    }

    /**
     * Selects the last eligible day of the current month
     *
     * Finds and clicks on the last day that is not disabled and belongs to the current month
     */
    async selectLastDayOfMonth() {
        const lastEligibleDay = this.pmuDaysLocator
                                    .locator(`> div.pmu-button:not(.pmu-disabled):not(.pmu-not-in-month)`)
                                    .last()
        await expect(lastEligibleDay).toBeVisible()
        await lastEligibleDay.click()
        await this.page.waitForTimeout(300)
    }
}

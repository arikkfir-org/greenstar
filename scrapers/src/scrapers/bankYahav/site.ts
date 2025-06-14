/**
 * Bank Yahav Site Interaction
 * 
 * This module provides a wrapper for interacting with the Bank Yahav website.
 * It handles authentication, navigation, and session management for the scraper.
 */

import { expect, FrameLocator, Locator, Page } from "@playwright/test"

import { AccountTransactionsPage } from "./account-transactions-page.ts"

/**
 * Site class for interacting with the Bank Yahav website
 *
 * Provides methods to log in, log out, and navigate to different sections of the website.
 * Handles authentication and session management for the scraper.
 */
export class Site {
    /**
     * Locator for the button that reveals the login form
     */
    private readonly loginRevealButtonLocator: Locator

    /**
     * Locator for the login iframe
     */
    private readonly loginIFrameLocator: FrameLocator

    /**
     * Locator for the username input field
     */
    private readonly usernameLocator: Locator

    /**
     * Locator for the PIN input field
     */
    private readonly pinnoLocator: Locator

    /**
     * Locator for the password input field
     */
    private readonly passwordLocator: Locator

    /**
     * Locator for the submit button on the main page
     */
    private readonly pageSubmitButtonLocator: Locator

    /**
     * Locator for the submit button in the login iframe
     */
    private readonly iframeSubmitButtonLocator: Locator

    /**
     * Creates a new Site instance
     *
     * @param {Page} page - The Playwright page object
     * @param {string} tenantID - The tenant ID for the current session
     * @param {string} accountID - The account ID for the current session
     * @param {string} username - The username for authentication
     * @param {string} password - The password for authentication
     * @param {string} pinno - The PIN number for authentication
     */
    constructor(
        private readonly page: Page,
        private readonly tenantID: string,
        private readonly accountID: string,
        private readonly username: string,
        private readonly password: string,
        private readonly pinno: string,
    ) {
        this.loginRevealButtonLocator  = this.page.locator(`button#mainLoginFormBtn`)
        this.loginIFrameLocator        = this.page.locator("iframe.login-iframe").contentFrame()
        this.usernameLocator           = this.loginIFrameLocator.locator(`input#username`)
        this.pinnoLocator              = this.loginIFrameLocator.locator(`input#pinno`)
        this.passwordLocator           = this.loginIFrameLocator.locator(`input#password`)
        this.pageSubmitButtonLocator   = this.page.locator("button[type=submit].btn-primary").getByText("כניסה")
        this.iframeSubmitButtonLocator = this.loginIFrameLocator.locator(`button[type=submit].btn-primary`).getByText(
            "כניסה")
    }

    /**
     * Opens the Bank Yahav website
     *
     * Navigates to the homepage and waits for the page to load completely
     */
    async open() {
        console.debug("Opening the bank website...")
        await this.page.goto("https://www.bank-yahav.co.il/")
        await this.page.waitForLoadState("networkidle")
    }

    /**
     * Logs in to the Bank Yahav website
     *
     * Performs the authentication process using the provided credentials.
     * Handles multiple authentication scenarios and redirects that may occur during login.
     * Waits for the login process to complete and verifies successful login.
     *
     * @throws {Error} If login fails or redirects to an unexpected URL
     */
    async login() {
        console.debug("Opening login page")

        await expect(this.loginRevealButtonLocator).toBeVisible()
        await this.loginRevealButtonLocator.click()

        // noinspection DuplicatedCode
        await expect(this.usernameLocator).toBeVisible()
        await this.usernameLocator.fill(this.username)

        await expect(this.pinnoLocator).toBeVisible()
        await this.pinnoLocator.fill(this.pinno)

        await expect(this.passwordLocator).toBeVisible()
        await this.passwordLocator.fill(this.password)

        await expect(this.iframeSubmitButtonLocator).toBeVisible()
        await this.iframeSubmitButtonLocator.click()

        // Handle redirects on the main bank website
        while (this.page.url().startsWith("https://www.bank-yahav.co.il/")) {
            await this.page.waitForLoadState("networkidle")
            await this.page.waitForTimeout(500 + Math.round(Math.random() * 500))
        }

        // Handle redirects on the login page
        while (this.page.url().startsWith("https://login.yahav.co.il/login/")) {
            console.debug("We are on the login IFRAME...")

            await this.page.waitForLoadState("networkidle")
            await this.page.waitForTimeout(3000 + Math.round(Math.random() * 2000))

            // noinspection DuplicatedCode
            await expect(this.usernameLocator).toBeVisible()
            await this.usernameLocator.fill(this.username)

            await expect(this.pinnoLocator).toBeVisible()
            await this.pinnoLocator.fill(this.pinno)

            await expect(this.passwordLocator).toBeVisible()
            await this.passwordLocator.fill(this.password)

            console.debug("Clicking submit button on the login IFRAME...")
            await expect(this.pageSubmitButtonLocator).toBeVisible()
            await this.pageSubmitButtonLocator.click()
            await this.page.waitForLoadState("networkidle")
        }

        // Verify successful login
        if (!this.page.url().startsWith("https://digital.yahav.co.il/")) {
            throw new Error(`Unexpected URL: ${this.page.url()}`)
        }

        await this.page.waitForLoadState("networkidle")
    }

    /**
     * Logs out from the Bank Yahav website
     *
     * Clicks the logout button and waits for the logout process to complete
     */
    async logout() {
        console.debug("Logging out...")
        await this.page.getByRole("button").getByText("יציאה").click()
        await this.page.waitForLoadState("networkidle")
    }

    /**
     * Navigates to the transactions page
     *
     * Clicks on the checking account link and waits for the transactions page to load.
     * Creates and returns an AccountTransactionsPage instance for interacting with the page.
     *
     * @returns {Promise<AccountTransactionsPage>} An instance of the transactions page
     */
    async openTransactionsPage(): Promise<AccountTransactionsPage> {
        console.debug("Opening the transactions page...")

        const checkingAccountLinkLocator = this.page.locator(`a[href="#/main/accounts/current/"]`)
        await expect(checkingAccountLinkLocator).toBeVisible()
        await checkingAccountLinkLocator.click()
        await this.page.waitForLoadState("networkidle")
        // TODO: loading-bar-spinner
        const txPage = new AccountTransactionsPage(this.page, this.tenantID, this.accountID)
        await txPage.awaitUntilVisible()
        return txPage
    }
}

import { expect, test } from "@playwright/test"

test.describe("dashboard", {}, () => {
    test("title", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("networkidle")
        await expect(page).toHaveTitle(/Home - GreenSTAR/)
    })
})

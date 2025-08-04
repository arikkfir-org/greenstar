import { Locator } from "@playwright/test"

export async function hasClass(locator: Locator, className: string): Promise<boolean> {
    const classes = (await locator.getAttribute("class"))?.split(" ") || []
    return classes.includes(className)
}

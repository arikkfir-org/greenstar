import { defineConfig, devices } from "@playwright/test"

import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve("../.env") })

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI
        ? [
            [ "list", { printSteps: true } ],
            [ "github" ],
            [
                "monocart-reporter", {
                name: "End-to-end Report",
                outputFile: "./monocart-report/index.html",
            },
            ],
        ]
        : [
            [ "list", { printSteps: true } ],
            [ "html", { open: "never" } ],
        ],
    use: {
        baseURL: "https://acme.app.greenstar.test",
        ignoreHTTPSErrors: false, //!!process.env.CI,
        screenshot: "on",
        trace: "on",
        video: "on",
    },
    expect: {
        timeout: 1000 * 15,
    },
    timeout: 1000 * 60 * 5,
    globalTimeout: 1000 * 60 * 10,
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                channel: 'chromium',
            },
        },
    ],
})

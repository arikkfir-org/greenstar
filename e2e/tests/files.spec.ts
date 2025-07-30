import { expect, test } from "@playwright/test"

test.describe("files", {}, () => {
    test("should be able to upload and download a file", async ({ request }) => {
        const tenantID = "acme"
        const fileName = "test.txt"

        const fileContent = Buffer.from("Test file content")
        const uploadResp    = await request.post(`https://api.greenstar.test/static/${tenantID}/${fileName}`, {
            multipart: {
                file1: {
                    name: "test1.txt",
                    mimeType: "text/plain",
                    buffer: fileContent,
                },
            },
        })
        expect(uploadResp.ok()).toBeTruthy()

        const downloadResp = await request.get(`https://api.greenstar.test/static/${tenantID}/${fileName}`)
        expect(downloadResp.ok()).toBeTruthy()

        const downloadedContent = await downloadResp.body()
        expect(Buffer.from(downloadedContent).toString()).toBe("Test file content")
    })
})

import { tools } from "../src/tools/registry"
import { expect, expectAccessible, test } from "./fixtures"

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme })

    test("home is accessible", async ({ page }) => {
      await page.goto("/")
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expectAccessible(page)
    })

    for (const tool of tools) {
      test(`${tool.id} renders and is accessible`, async ({ page }) => {
        await page.goto(`/${tool.id}`)
        await expect(page.getByRole("heading", { level: 1, name: tool.name })).toBeVisible()
        await page.waitForLoadState("networkidle")
        await expectAccessible(page)
      })
    }
  })
}

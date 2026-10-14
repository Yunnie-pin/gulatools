import { expect, expectAccessible, test } from "./fixtures"

test.describe("English browser", () => {
  test.use({ locale: "en-US" })

  test("detects English and localizes UI and errors", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
    await expect(page.getByRole("heading", { level: 1, name: "Developer tools, right in your browser." })).toBeVisible()
    await expect(page).toHaveTitle("GulaTools: developer tools in your browser")
    await expectAccessible(page)

    await page.goto("/base64")
    await page.getByText("Decode", { exact: true }).click()
    await page.locator(".cm-content").first().click()
    await page.keyboard.type("%%%")
    await expect(page.getByRole("alert")).toHaveText("Input is not valid Base64")
  })
})

test("language switcher persists the choice", async ({ page }) => {
  await page.goto("/jwt")
  await expect(page.getByRole("heading", { level: 1, name: "JWT" })).toBeVisible()
  await expect(page.locator("html")).toHaveAttribute("lang", "id")

  await page.getByRole("button", { name: /Pin sidebar/ }).click()
  await page.locator("aside").getByText("English", { exact: true }).click()
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("button", { name: "Add to favorites" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Verify signature" })).toBeVisible()

  await page.reload()
  await expect(page.getByRole("button", { name: "Add to favorites" })).toBeVisible()
  await page.locator("aside").getByText("Indonesia", { exact: true }).click()
  await expect(page.getByRole("button", { name: "Tambah ke favorit" })).toBeVisible()
})

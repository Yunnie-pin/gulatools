import { editorOutput, expect, expectAccessible, test } from "./fixtures"

test("English pages live under /en with English UI, metadata, and errors", async ({ page }) => {
  await page.goto("/en/")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("heading", { level: 1, name: "Developer tools, right in your browser." })).toBeVisible()
  await expect(page).toHaveTitle("GulaTools: developer tools in your browser")
  await expectAccessible(page)

  await page
    .getByRole("link", { name: /^Base64/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/en\/base64$/)
  await page.getByText("Decode", { exact: true }).click()
  await page.locator(".cm-content").first().click()
  await page.keyboard.type("%%%")
  await expect(page.getByRole("alert")).toHaveText("Input is not valid Base64")
})

test("language switcher moves between the paired URLs", async ({ page }) => {
  await page.goto("/jwt")
  await expect(page.locator("html")).toHaveAttribute("lang", "id")

  await page.getByRole("button", { name: /Pin sidebar/ }).click()
  await page.locator("aside").getByText("English", { exact: true }).click()
  await expect(page).toHaveURL(/\/en\/jwt$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("button", { name: "Add to favorites" })).toBeVisible()

  await page.reload()
  await expect(page.getByRole("button", { name: "Add to favorites" })).toBeVisible()
  await page.locator("aside").getByText("Indonesia", { exact: true }).click()
  await expect(page).toHaveURL(/\/jwt$/)
  await expect(page.getByRole("button", { name: "Tambah ke favorit" })).toBeVisible()
})

test.describe("English browser on an Indonesian page", () => {
  test.use({ locale: "en-US" })

  test("suggests the English version without redirecting, and remembers a dismissal", async ({ page }) => {
    await page.goto("/jwt")
    await expect(page).toHaveURL(/\/jwt$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "id")
    const hint = page.getByText("This page is also available in English.")
    await expect(hint).toBeVisible()
    await expectAccessible(page)

    await page.getByRole("link", { name: "Open the English version" }).click()
    await expect(page).toHaveURL(/\/en\/jwt$/)
    await expect(hint).toHaveCount(0)

    await page.goto("/jwt")
    await page.getByRole("button", { name: "Close" }).click()
    await page.reload()
    await expect(page.getByRole("heading", { level: 1, name: "JWT" })).toBeVisible()
    await expect(hint).toHaveCount(0)
  })
})

test("Japanese pages live under /ja with Japanese UI and errors", async ({ page }) => {
  await page.goto("/ja/base64")
  await expect(page.locator("html")).toHaveAttribute("lang", "ja")
  await expect(page.getByRole("button", { name: "お気に入りに追加" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Base64 について" })).toBeVisible()
  await page.getByText("Decode", { exact: true }).click()
  await page.locator(".cm-content").first().click()
  await page.keyboard.type("%%%")
  await expect(page.getByRole("alert")).toHaveText("有効な Base64 ではありません")
  await expectAccessible(page)

  await page.getByRole("button", { name: /サイドバー.*固定/ }).click()
  await page.locator("aside").getByText("English", { exact: true }).click()
  await expect(page).toHaveURL(/\/en\/base64$/)
})

test("samples follow the page language", async ({ page }) => {
  await page.goto("/ja/slug")
  await page.getByRole("button", { name: "サンプル" }).click()
  await expect(editorOutput(page)).toContainText("kyoto-no-cafe-e-yokoso")

  await page.goto("/en/text-stats")
  await page.getByRole("button", { name: "Sample" }).click()
  await expect(page.getByLabel("Text", { exact: true })).toHaveValue(/^Sugar/)
})

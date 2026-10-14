import { expect, expectAccessible, test } from "./fixtures"

test("drawer opens, navigates and closes", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Buka menu" }).click()
  const drawer = page.getByRole("dialog", { name: "Menu" })
  await expect(drawer).toBeVisible()
  await expectAccessible(page)
  await drawer.getByRole("link", { name: "Base64", exact: true }).click()
  await expect(page).toHaveURL(/\/base64$/)
  await expect(drawer).toBeHidden()
})

test("header stays visible while scrolling", async ({ page }) => {
  await page.goto("/regex")
  await page.evaluate(() => window.scrollTo(0, 900))
  const menu = page.getByRole("button", { name: "Buka menu" })
  await expect(menu).toBeInViewport()
  await page.getByRole("button", { name: "Cari tool" }).click()
  await expect(page.getByRole("dialog", { name: "Cari tool" })).toBeVisible()
})

import { tools } from "../src/tools/registry"
import { editorOutput, expect, expectAccessible, openWithSample, test } from "./fixtures"

test("pages set their document title", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle("GulaTools: developer tools di browser")
  await page.goto("/jwt")
  await expect(page).toHaveTitle("JWT · GulaTools")
  await page.goto("/tidak-ada")
  await expect(page.getByRole("heading", { name: "Tool tidak ditemukan" })).toBeVisible()
})

test("skip link and focus move to the main content", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Tab")
  const skip = page.getByRole("link", { name: "Lewati ke konten" })
  await expect(skip).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("main#content")).toBeFocused()

  await page.locator("aside").getByRole("link", { name: "Base64", exact: true }).click()
  await expect(page.locator("main#content")).toBeFocused()
})

test("command palette searches and navigates", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Control+k")
  await page.keyboard.type("json form")
  await expect(page.getByRole("option", { name: /JSON Formatter/ })).toBeVisible()
  await expectAccessible(page)
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/json-formatter$/)
  await expect(page.locator("dialog[open]")).toHaveCount(0)
})

test("sidebar expands on hover, not after a mouse click, and can be pinned", async ({ page }) => {
  await page.goto("/jwt")
  await expect(page.getByRole("heading", { level: 1, name: "JWT" })).toBeVisible()
  const panel = page.locator("aside > div").first()
  const width = async () => Math.round((await panel.boundingBox())?.width ?? 0)
  await page.mouse.move(900, 500)
  await expect.poll(width).toBe(76)
  await page.mouse.move(40, 300)
  await expect.poll(width).toBe(264)
  await page.locator("aside").getByRole("link", { name: "Base64", exact: true }).click()
  await page.mouse.move(900, 500)
  await expect.poll(width).toBe(76)

  await page.mouse.move(40, 300)
  await page.getByRole("button", { name: /Pin sidebar/ }).click()
  await page.mouse.move(900, 500)
  await page.reload()
  await expect.poll(width).toBe(264)
})

test("favorites and recent tools appear on the home page", async ({ page }) => {
  await page.goto("/jwt")
  await page.getByRole("button", { name: "Tambah ke favorit" }).click()
  await page.goto("/cron")
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Milikmu" })).toBeVisible()
  const strip = page.locator("section[aria-labelledby=continue-heading]")
  await expect(strip.getByRole("link")).toHaveText([/Cron Parser/, /JWT/])
  await expect(page.locator("aside").getByRole("heading", { name: "Favorit" })).toBeVisible()
  await expectAccessible(page)
  await page.getByRole("button", { name: "Hapus riwayat" }).click()
  await expect(strip).toHaveCount(0)
})

test("theme switcher follows the system and remembers choices", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme)
  expect(await theme()).toBe("dark")
  await page.emulateMedia({ colorScheme: "light" })
  await expect.poll(theme).toBe("light")
  await page.mouse.move(40, 400)
  await page.locator("aside").getByTitle("Gelap").click()
  await page.reload()
  expect(await theme()).toBe("dark")
  await expectAccessible(page)
})

test("share link restores the input", async ({ page, context }) => {
  await page.addInitScript(() => {
    navigator.clipboard.writeText = async (text: string) => {
      document.documentElement.dataset.copied = text
    }
  })
  await openWithSample(page, "/json-formatter")
  await page.getByRole("button", { name: "Opsi lain" }).click()
  await page.getByRole("menuitem", { name: "Salin tautan berbagi" }).click()
  await expect(page.getByText("Tautan berbagi tersalin")).toBeVisible()
  const url = (await page.evaluate(() => document.documentElement.dataset.copied)) ?? ""
  expect(url).toMatch(/\/json-formatter#s=[\w-]+$/)

  const shared = await context.newPage()
  await shared.goto(url)
  await expect(shared.locator(".cm-content").first()).toContainText('"name":"GulaTools"')
  await expect(editorOutput(shared)).toContainText('"name": "GulaTools"')
  expect(new URL(shared.url()).hash).toBe("")
})

test("works offline once the service worker is installed", async ({ page, context }) => {
  await page.goto("/")
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

  await context.setOffline(true)
  for (const tool of tools.filter((t) => ["cron", "code-formatter", "argon2"].includes(t.id))) {
    await page.goto(`/${tool.id}`)
    await expect(page.getByRole("heading", { level: 1, name: tool.name })).toBeVisible()
  }
  await context.setOffline(false)
})

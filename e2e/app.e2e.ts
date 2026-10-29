import { tools } from "../src/tools/registry"
import { editorOutput, expect, expectAccessible, openWithSample, test } from "./fixtures"

test("pages set their document title", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle("GulaTools: developer tools di browser")
  await page.goto("/jwt")
  await expect(page).toHaveTitle("JWT · GulaTools")
  await page.goto("/tidak-ada")
  await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible()
  await expect(page).toHaveTitle("Halaman tidak ditemukan · GulaTools")
})

test("404 page suggests the tool a mistyped URL was probably after", async ({ page }) => {
  await page.goto("/jwtt")
  await expect(page.getByText("/jwtt", { exact: true })).toBeVisible()
  const suggestions = page.getByRole("navigation", { name: "Mungkin maksud kamu" })
  await suggestions.getByRole("link", { name: /^JWT/ }).click()
  await expect(page).toHaveURL(/\/jwt$/)
  await expect(page.getByRole("heading", { level: 1, name: "JWT" })).toBeVisible()

  await page.goto("/en/zzzzqqq")
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Did you mean" })).toHaveCount(0)
  await page
    .getByRole("main")
    .getByRole("button", { name: /Search tools/ })
    .click()
  await expect(page.getByRole("dialog", { name: "Search tools" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expectAccessible(page)
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

test("about dialog points visitors to the open source repository", async ({ page }) => {
  await page.goto("/")
  await page.locator("aside").getByRole("button", { name: "Tentang GulaTools" }).click()
  const dialog = page.getByRole("dialog", { name: "Open source" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("link", { name: "Lihat di GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/Yunnie-pin/gulatools",
  )
  await expectAccessible(page)
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
})

test("tool input and options survive leaving the route and closing the tab", async ({ page }) => {
  await openWithSample(page, "/json-formatter")
  await page.getByText("Minify", { exact: true }).click()
  const minified = '{"name":"GulaTools","private":true'
  await expect(editorOutput(page)).toContainText(minified)

  await page.locator("aside").getByRole("link", { name: "Base64", exact: true }).click()
  await page.locator("aside").getByRole("link", { name: "JSON Formatter", exact: true }).click()
  await expect(editorOutput(page)).toContainText(minified)

  await page.reload()
  await expect(editorOutput(page)).toContainText(minified)
})

test("sensitive tools remember options but never store secrets", async ({ page }) => {
  await page.goto("/hmac")
  await page.getByLabel("Pesan").fill("pesan-sangat-rahasia")
  await page.getByLabel("Kunci rahasia").fill("kunci-sangat-rahasia")
  await page.goto("/aes")
  await page.getByLabel("Teks").fill("teks-sangat-rahasia")
  await page.getByLabel("Password").fill("password-sangat-rahasia")
  await page.getByText("Dekripsi", { exact: true }).first().click()

  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }))
  expect(stored).not.toContain("sangat-rahasia")
  expect(stored).toContain("gulatools:tool:aes:mode")

  await page.reload()
  await expect(page.getByLabel("Data terenkripsi (Base64)")).toHaveValue("")
  await expect(page.getByLabel("Password")).toHaveValue("")
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

test("dialogs close when clicking outside, but not when a drag ends outside", async ({ page }) => {
  await page.goto("/")
  await page.locator("aside").getByRole("button", { name: "Tentang GulaTools" }).click()
  const about = page.getByRole("dialog", { name: "Open source" })
  await expect(about).toBeVisible()

  await about.getByRole("heading").click()
  await expect(about).toBeVisible()

  const box = await about.boundingBox()
  if (!box) throw new Error("dialog has no box")
  await page.mouse.move(box.x + 20, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(5, 5)
  await page.mouse.up()
  await expect(about).toBeVisible()

  await page.mouse.click(5, 5)
  await expect(about).toBeHidden()

  await page.keyboard.press("Control+k")
  const palette = page.getByRole("dialog", { name: "Cari tool" })
  await expect(palette).toBeVisible()
  await page.mouse.click(5, 5)
  await expect(palette).toBeHidden()
})

test("a new service worker takes over without waiting for every tab to close", async ({ request }) => {
  const sw = await (await request.get("/sw.js")).text()
  expect(sw).toContain("self.skipWaiting()")
  expect(sw).toContain("clientsClaim()")
})

test("tool page links to the tool's source folder on GitHub", async ({ page }) => {
  await page.goto("/jwt")
  const link = page.getByRole("link", { name: "Lihat kode tool ini di GitHub" })
  await expect(link).toHaveAttribute("href", "https://github.com/Yunnie-pin/gulatools/tree/main/src/tools/jwt")
  await expect(link).toHaveAttribute("target", "_blank")
})

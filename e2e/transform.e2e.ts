import { editorOutput, expect, expectAccessible, openWithSample, test } from "./fixtures"

test("JSON formatter formats, minifies and reports errors", async ({ page }) => {
  await openWithSample(page, "/json-formatter")
  await expect(editorOutput(page)).toContainText('"name": "GulaTools"')
  await page.getByText("Minify", { exact: true }).click()
  await expect(editorOutput(page)).toContainText('{"name":"GulaTools","private":true')
  await page.locator(".cm-content").first().click()
  await page.keyboard.press("End")
  await page.keyboard.type("x")
  await expect(page.getByRole("alert")).toContainText("JSON")
  await expectAccessible(page)
})

test("code formatter runs prettier for JS and TypeScript", async ({ page }) => {
  await openWithSample(page, "/code-formatter")
  await expect(editorOutput(page)).toContainText("const greet = (name) => {")
  await page.getByRole("button", { name: /^Bahasa:/ }).click()
  await page.getByRole("option", { name: "TypeScript" }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toContainText("interface User {")
})

test("SQL formatter switches dialect with the dropdown", async ({ page }) => {
  await openWithSample(page, "/sql-formatter")
  await expect(editorOutput(page)).toContainText("SELECT")
  const trigger = page.getByRole("button", { name: /^Dialek:/ })
  await trigger.click()
  await page.keyboard.press("p")
  await page.keyboard.press("Enter")
  await expect(trigger).toHaveAccessibleName("Dialek: PostgreSQL")
  await expect(trigger).toBeFocused()
})

test("data converter turns CSV into JSON", async ({ page }) => {
  await page.goto("/data-converter")
  await page.getByRole("button", { name: /^Dari:/ }).click()
  await page.getByRole("option", { name: "CSV" }).click()
  await page.getByRole("button", { name: /^Ke:/ }).click()
  await page.getByRole("option", { name: "JSON" }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toContainText('"name": "Gula"')
})

test("JSON to TypeScript infers interfaces", async ({ page }) => {
  await openWithSample(page, "/json-to-ts")
  await expect(editorOutput(page)).toContainText("export interface Root {")
  await expect(editorOutput(page)).toContainText("notes?: string")
  await page.getByText("Zod", { exact: true }).click()
  await expect(editorOutput(page)).toContainText("z.object({")
})

test("JSONPath filters with expressions", async ({ page }) => {
  await openWithSample(page, "/jsonpath")
  await expect(editorOutput(page)).toContainText('"Bumi Manusia"')
  await expect(editorOutput(page)).not.toContainText("Laskar Pelangi")
})

test("Base64 and URL encoder produce expected output", async ({ page }) => {
  await openWithSample(page, "/base64")
  await expect(editorOutput(page)).toHaveText("R3VsYSBpdHUgbWFuaXMg4oCUIMO8bsOvY8O2ZMOp")
  await openWithSample(page, "/url-encoder")
  await expect(editorOutput(page)).toHaveText("q%3Dgula%20manis%26lang%3Did")
})

test("HTML entity decode resolves named and numeric entities without parsing tags", async ({ page }) => {
  await openWithSample(page, "/html-entity")
  await expect(editorOutput(page)).toHaveText("&lt;p class=&quot;note&quot;&gt;Gula &amp; kopi — © 2026&lt;/p&gt;")
  await page.getByText("Decode", { exact: true }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toHaveText("<p>Gula & kopi — © 2026 🍬</p>")
})

test("TransformTool menu opens with keyboard and offers download", async ({ page }) => {
  await openWithSample(page, "/json-formatter")
  await page.getByRole("button", { name: "Opsi lain" }).click()
  await expect(page.getByRole("menuitem", { name: "Buka file…" })).toBeFocused()
  await page.keyboard.press("ArrowDown")
  const download = page.waitForEvent("download")
  await page.keyboard.press("Enter")
  expect((await download).suggestedFilename()).toBe("output.json")
})

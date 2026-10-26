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
  await expect(editorOutput(page)).toContainText('"name": "Alice"')
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
  await expect(editorOutput(page)).toContainText('"Dune"')
  await expect(editorOutput(page)).not.toContainText("The Hobbit")
})

test("Base64 and URL encoder produce expected output", async ({ page }) => {
  await openWithSample(page, "/base64")
  await expect(editorOutput(page)).toHaveText("U3VnYXIgaXMgc3dlZXQg4oCUIMO8bsOvY8O2ZMOp")
  await openWithSample(page, "/url-encoder")
  await expect(editorOutput(page)).toHaveText("q%3Dsweet%20sugar%26lang%3Den")
})

test("HTML entity decode resolves named and numeric entities without parsing tags", async ({ page }) => {
  await openWithSample(page, "/html-entity")
  await expect(editorOutput(page)).toHaveText("&lt;p class=&quot;note&quot;&gt;Sugar &amp; spice — © 2026&lt;/p&gt;")
  await page.getByText("Decode", { exact: true }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toHaveText("<p>Sugar & spice — © 2026 🍬</p>")
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

test("text escape quotes for SQL and round-trips JSON", async ({ page }) => {
  await openWithSample(page, "/text-escape")
  await expect(editorOutput(page)).toHaveText('Say \\"hello\\"\\nthen\\tleave')
  await page.getByText("SQL", { exact: true }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toHaveText("'O''Brien'")
  await page.getByText("Unescape JSON", { exact: true }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toContainText('Say "hello"')
})

test("markdown preview renders GFM and strips scripts and remote resources", async ({ page, guard }) => {
  await openWithSample(page, "/markdown")
  const preview = page.locator(".markdown-body")
  await expect(preview.getByRole("heading", { level: 1 })).toHaveText("GulaTools")
  await expect(preview.getByRole("table")).toBeVisible()
  await expect(preview.getByRole("link", { name: "GitHub" })).toHaveAttribute("target", "_blank")

  await page
    .locator(".cm-content")
    .first()
    .fill(
      '<img src=x onerror="window.pwned=1"><script>window.pwned=2</script>\n\n![logo](https://example.com/logo.png)\n\n<p style="background:url(https://example.com/bg.png)">teks</p>',
    )
  await expect(preview).toContainText("teks")
  expect(await page.evaluate(() => "pwned" in window)).toBe(false)
  await expect(preview.locator("img[onerror], script, [style], img[src^='https']")).toHaveCount(0)

  // Under a CSP, Chrome reports (without running) inline handlers merely parsed by DOMPurify's DOMParser.
  guard.errors = guard.errors.filter((error) => !error.includes("inline event handler"))
})

test("SVG optimizer shrinks the sample and offers preview and download", async ({ page }) => {
  await openWithSample(page, "/svg-optimizer")
  await expect(page.getByText(/lebih kecil\)/)).toBeVisible()
  await expect(editorOutput(page)).toContainText('<svg xmlns="http://www.w3.org/2000/svg"')
  await expect(editorOutput(page)).not.toContainText("metadata")
  await expectAccessible(page)

  await page.getByText("Pratinjau", { exact: true }).click()
  await expect(page.getByRole("img", { name: "Pratinjau SVG" })).toBeVisible()
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "Unduh SVG" }).click()
  expect((await download).suggestedFilename()).toBe("optimized.svg")
})

test("cURL converter turns the sample into fetch and Python", async ({ page }) => {
  await openWithSample(page, "/curl")
  await expect(editorOutput(page)).toContainText('await fetch("https://api.example.com/v1/users"')
  await page.getByText("Python requests", { exact: true }).click()
  await expect(editorOutput(page)).toContainText("response = requests.post(")
  await expectAccessible(page)
})

test("sort lines sorts naturally and removes duplicates", async ({ page }) => {
  await openWithSample(page, "/sort-lines")
  await expect(editorOutput(page)).toHaveText(/^apple.*banana.*cherry.*file2\.txt.*file10\.txt$/)
  await page.getByLabel("Abaikan huruf besar/kecil").check()
  await expect(editorOutput(page)).toHaveText(/^Applebanana/)
  await expectAccessible(page)
})

test("slug generator transliterates the sample titles", async ({ page }) => {
  await openWithSample(page, "/slug")
  await expect(editorOutput(page)).toContainText("cara-membuat-kue-brulee-yang-lezat")
  await expect(editorOutput(page)).toContainText("strasse-nach-sao-paulo")
  await expectAccessible(page)
})

test("gzip compresses and the sample decompresses back to text", async ({ page }) => {
  await openWithSample(page, "/gzip")
  await expect(editorOutput(page)).toHaveText(/^H4sI/)
  await page.getByText("Base64 → Dekompres", { exact: true }).click()
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toContainText('"tool":"gzip"')
  await expectAccessible(page)
})

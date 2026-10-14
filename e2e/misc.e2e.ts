import { readFile } from "node:fs/promises"
import { expect, expectAccessible, test } from "./fixtures"

test("regex shows matches and stops catastrophic patterns", async ({ page }) => {
  await page.goto("/regex")
  await expect(page.getByText("3 cocok")).toBeVisible()
  await page.getByLabel("Pola regex").fill("(a+)+$")
  await page.getByLabel("Teks uji").fill(`${"a".repeat(40)}!`)
  await expect(page.getByRole("alert")).toContainText("lebih dari 1 detik", { timeout: 5_000 })
})

test("diff counts added and removed lines", async ({ page }) => {
  await page.goto("/diff")
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(page.getByText("+2")).toBeVisible()
  await expect(page.getByText("−1")).toBeVisible()
  await expectAccessible(page)
})

test("case converter, cron, color and timestamp", async ({ page }) => {
  await page.goto("/case-converter")
  await page.getByLabel("Teks").fill("user profile id")
  await expect(page.locator("code").first()).toHaveText("userProfileId")

  await page.goto("/cron")
  await expect(page.getByText("Pada 09:00, Senin sampai Jumat")).toBeVisible()
  await page.getByLabel("Ekspresi cron").fill("61 * * * *")
  await expect(page.getByRole("alert")).toContainText("tidak valid")

  await page.goto("/color")
  await page.getByLabel("Warna", { exact: true }).fill("rebeccapurple")
  await expect(page.locator("code").first()).toHaveText("#663399")

  await page.goto("/timestamp")
  await page.getByLabel("Timestamp atau tanggal").fill("1760000000123")
  await expect(page.getByText("Terbaca sebagai milidetik")).toBeVisible()
  await expect(page.locator("code").nth(2)).toHaveText("2025-10-09T08:53:20.123Z")
})

test("QR code round-trips through the scanner and image tool", async ({ page }) => {
  await page.goto("/qr")
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "PNG" }).click()
  const png = await readFile((await (await download).path()) ?? "")

  await page.getByText("Pindai", { exact: true }).click()
  const chooser = page.waitForEvent("filechooser")
  await page.getByRole("button", { name: "Pilih gambar" }).click()
  await (await chooser).setFiles({ name: "qr.png", mimeType: "image/png", buffer: png })
  await expect(page.locator("main p.font-mono")).toHaveText("https://gulatools.dev")

  await page.goto("/image-base64")
  const chooser2 = page.waitForEvent("filechooser")
  await page.getByRole("button", { name: "Pilih gambar" }).click()
  await (await chooser2).setFiles({ name: "qr.png", mimeType: "image/png", buffer: png })
  await expect(page.getByText("1024 × 1024 px")).toBeVisible()
  await expect(page.locator("main code").first()).toContainText("data:image/png;base64,iVBOR")
})

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

test("text stats counts graphemes and lists hidden characters from the sample", async ({ page }) => {
  await page.goto("/text-stats")
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(page.getByText("2 jenis karakter tak terlihat")).toBeVisible()
  await expect(page.getByText("ZERO WIDTH SPACE")).toBeVisible()
  await expect(page.getByText("NO-BREAK SPACE", { exact: true })).toBeVisible()
  await expect(page.getByText("ZERO WIDTH JOINER")).toHaveCount(0)
})

test("chmod checkboxes and the mode input stay in sync", async ({ page }) => {
  await page.goto("/chmod")
  const mode = page.getByLabel("Mode", { exact: true })
  await mode.fill("644")
  await page.getByRole("group", { name: "Pemilik" }).getByLabel("Eksekusi").check()
  await expect(mode).toHaveValue("744")
  await mode.fill("rwsr-xr-x")
  await expect(page.getByLabel("setuid")).toBeChecked()
  await expect(page.locator("main code").first()).toHaveText("4755")
})

test("subnet calculator derives the host range", async ({ page }) => {
  await page.goto("/cidr")
  await page.getByLabel("Alamat IPv4 dan prefix").fill("10.0.5.77/22")
  await expect(page.locator("main code").first()).toHaveText("10.0.4.0/22")
  await expect(page.getByText("10.0.7.254")).toBeVisible()
})

test("contrast checker grades AA/AAA and swaps colors", async ({ page }) => {
  await page.goto("/contrast")
  await page.getByLabel("Warna teks", { exact: true }).fill("#777777")
  await expect(page.getByText("4.48:1")).toBeVisible()
  await expect(page.getByRole("listitem").filter({ hasText: /^AATeks normal/ })).toContainText("Gagal")
  await expect(page.getByRole("listitem").filter({ hasText: /^AATeks besar/ })).toContainText("Lulus")
  await page.getByRole("button", { name: "Tukar warna" }).click()
  await expect(page.getByLabel("Warna latar", { exact: true })).toHaveValue("#777777")
  await expect(page.getByText("4.48:1")).toBeVisible()
})

test("lorem ipsum follows the chosen unit and count", async ({ page }) => {
  await page.goto("/lorem")
  await expect(page.locator("main .cm-content")).toContainText(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  )
  await page.getByText("Kata", { exact: true }).click()
  await page.getByLabel("Jumlah").fill("5")
  await expect(page.locator("main .cm-content")).toHaveText("Lorem ipsum dolor sit amet")
  await page.getByLabel("Mulai dengan Lorem ipsum").uncheck()
  await expect(page.locator("main .cm-content")).not.toHaveText("Lorem ipsum dolor sit amet")
})

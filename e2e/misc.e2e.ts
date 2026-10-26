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

test("JSON schema validator lists every error and turns valid when fixed", async ({ page }) => {
  await page.goto("/json-schema")
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(page.getByText("4 error")).toBeVisible()
  await expect(page.getByText("JSON Schema 2020-12")).toBeVisible()
  const issues = page.getByRole("list", { name: "Daftar error" })
  await expect(issues).toContainText('/emailmust match format "email"')
  await expect(issues).toContainText("/must NOT have additional properties: color")
  await expectAccessible(page)

  await page.locator(".cm-content").nth(1).fill('{"name":"Jane","email":"jane@example.com","tags":["sweet"]}')
  await expect(page.getByText("Valid", { exact: true })).toBeVisible()
  await expect(issues).toHaveCount(0)
})

test("X.509 decoder shows certificate details for a pasted chain", async ({ page }) => {
  await page.goto("/x509")
  const input = page.getByRole("textbox", { name: "Sertifikat" })
  await input.fill(`-----BEGIN CERTIFICATE-----
MIICEjCCAbigAwIBAgIDGis8MAoGCCqGSM49BAMCMDoxCzAJBgNVBAYTAklEMRMw
EQYDVQQKDApHdWxhIFRvb2xzMRYwFAYDVQQDDA1ndWxhdG9vbHMuZGV2MB4XDTI2
MTAxNDE0MjEwMVoXDTM2MTAxMTE0MjEwMVowOjELMAkGA1UEBhMCSUQxEzARBgNV
BAoMCkd1bGEgVG9vbHMxFjAUBgNVBAMMDWd1bGF0b29scy5kZXYwWTATBgcqhkjO
PQIBBggqhkjOPQMBBwNCAATGnZ0eF547IwlXeoWD7sq+hIfSnkteuG1AaedxQT+r
r+aWruZIbSzDcPRV7E4yrgZQtyTMom/mg6qv+12ZEv+do4GsMIGpMB0GA1UdDgQW
BBSUr/NHRPNs5xhYu6yHT6JB9aViZTAfBgNVHSMEGDAWgBSUr/NHRPNs5xhYu6yH
T6JB9aViZTBDBgNVHREEPDA6gg1ndWxhdG9vbHMuZGV2gg8qLmd1bGF0b29scy5k
ZXaHBH8AAAGBEmhhbG9AZ3VsYXRvb2xzLmRldjASBgNVHRMBAf8ECDAGAQH/AgEA
MA4GA1UdDwEB/wQEAwIBhjAKBggqhkjOPQQDAgNIADBFAiEAr5dFPiJcTh7EJMMr
jTiD7PNJMLsI2tZLkDgdpKq6cWQCIDmJGJaumx6WT6JTkTkM8ZUej8n03NIYQDGj
wa4nf7FP
-----END CERTIFICATE-----`)
  await expect(page.getByText("Berlaku", { exact: true })).toBeVisible()
  await expect(page.locator("main")).toContainText("CN=gulatools.dev, O=Gula Tools, C=ID")
  await expect(page.locator("main")).toContainText("DNS:gulatools.dev, DNS:*.gulatools.dev, IP:127.0.0.1")
  await expect(page.locator("main")).toContainText("ED:93:3D:F8:75:53:02:19")
  await expectAccessible(page)

  await input.fill(`-----BEGIN CERTIFICATE-----
MIICEjCCAbigAwIBAgIDGis8MAoGCCqGSM49BAMCMDoxCzAJBgNVBAYTAklEMRMw
EQYDVQQKDApHdWxhIFRvb2xzMRYwFAYDVQQDDA1ndWxhdG9vbHMuZGV2MB4XDTI2
MTAxNDE0MjEwMVoXDTM2MTAxMTE0MjEwMVowOjELMAkGA1UEBhMCSUQxEzARBgNV
BAoMCkd1bGEgVG9vbHMxFjAUBgNVBAMMDWd1bGF0b29scy5kZXYwWTATBgcqhkjO
PQIBBggqhkjOPQMBBwNCAATGnZ0eF547IwlXeoWD7sq+hIfSnkteuG1AaedxQT+r
r+aWruZIbSzDcPRV7E4yrgZQtyTMom/mg6qv+12ZEv+do4GsMIGpMB0GA1UdDgQW
BBSUr/NHRPNs5xhYu6yHT6JB9aViZTAfBgNVHSMEGDAWgBSUr/NHRPNs5xhYu6yH
T6JB9aViZTBDBgNVHREEPDA6gg1ndWxhdG9vbHMuZGV2gg8qLmd1bGF0b29scy5k
ZXaHBH8AAAGBEmhhbG9AZ3VsYXRvb2xzLmRldjASBgNVHRMBAf8ECDAGAQH/AgEA
MA4GA1UdDwEB/wQEAwIBhjAKBggqhkjOPQQDAgNIADBFAiEAr5dFPiJcTh7EJMMr
jTiD7PNJMLsI2tZLkDgdpKq6cWQCIDmJGJaumx6WT6JTkTkM8ZUej8n03NIYQDGj
wa4nf7FP
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIDLTCCAhWgAwIBAgIUduOKnS+k+KFrmODenzUde/AmPD4wDQYJKoZIhvcNAQEL
BQAwJjETMBEGA1UEAwwKS29waSBQYWhpdDEPMA0GA1UECgwGV2FydW5nMB4XDTI2
MTAxNDE0MjEwMVoXDTI2MTExMzE0MjEwMVowJjETMBEGA1UEAwwKS29waSBQYWhp
dDEPMA0GA1UECgwGV2FydW5nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEA2tCGuo5eMSZDMHvPXbILhwM/K9B+YN8l6wcuk7lvWD3lfeSx9dENhnDIPKLe
DdjDqt4mwyysTwfAdwEbkTA3KG24bOOHkoTlLAN+nIJycuNPI8Y0pZkK7WzamTSE
yDcfeZfklOhzGz6YAxuaGUuQxfcf6GHEwsr0M9H567pXVWC3YkMaM+E21EW6jFhe
Hr7QYBD1jKimsCmEVKVLGOi7dCKDttVJj0lrJXlSBeHu3OEoXr+zdo/xwEo6dNbS
fmN6gzKNUf5rtQb5D9Anv+ZAqeBVQb58IEJXjPjy0gxpWxxLi4gaC0D33yawhZFu
UamAltCD0FxzAqqE//crXE6QewIDAQABo1MwUTAdBgNVHQ4EFgQU6MiIcdCQh8jb
llhlavW6410+DTwwHwYDVR0jBBgwFoAU6MiIcdCQh8jbllhlavW6410+DTwwDwYD
VR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAlx7p4SKltPm+XJRy4T7W
XCjpzzLFg9wu+6hE0ZHZSk8/eNTEiFEJSXrsjK8E0AYm8E8pCDyFdoOm5uiRigg+
o0crue/MBckPhIkQssSUG9MkIt8M7OcBLqDFAz7eQTV/KHAM19YbeAsF2kbbxb8V
c2DFkHlBGDoDlCx+gp07Em/UbhYANpxbtnTcEjBVsRAJoIjUR5NtHHKrTxv801QR
llvr8Az6jLm+Zgb4o1WpfU5xiEU4Wbm7VcaBiBIVk0bbkH4OvVZsQHVOWV2RuxeX
E6Sz5lLCxfYyQpw2pR6W4M9RW1ji2Juy3G8MGUw3l4yuASFCiaXyePj5J8sohqg2
FQ==
-----END CERTIFICATE-----`)
  await expect(page.getByRole("heading", { name: "Sertifikat 2 dari 2" })).toBeVisible()
  await expect(page.locator("main")).toContainText("RSA · 2048 bit · e=65537")
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }))
  expect(stored).not.toContain("BEGIN CERTIFICATE")
})

test("image compressor resizes and converts to JPEG for download", async ({ page }) => {
  await page.goto("/image-tools")
  const chooser = page.waitForEvent("filechooser")
  await page.getByRole("button", { name: "Pilih gambar" }).click()
  await (await chooser).setFiles({
    name: "ikon.png",
    mimeType: "image/png",
    buffer: await readFile("public/pwa-512.png"),
  })
  await expect(page.getByText("ikon.png · ")).toContainText("512 × 512 px")

  await page.getByText("JPEG", { exact: true }).click()
  await page.getByLabel("Lebar (px)").fill("256")
  await expect(page.getByText("256 × 256 px")).toBeVisible()
  await expect(page.getByRole("img", { name: "Hasil" })).toBeVisible()
  await expectAccessible(page)

  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "Unduh" }).click()
  expect((await download).suggestedFilename()).toBe("ikon.jpg")
  const jpeg = await readFile((await (await download).path()) ?? "")
  expect([...jpeg.subarray(0, 2)]).toEqual([0xff, 0xd8])
})

test("dropdown options stay above the panels below them", async ({ page }) => {
  await page.goto("/keygen")
  await page
    .getByRole("button", { name: /Buat|Generate/ })
    .first()
    .click()
  await expect(page.getByText("Public key (PEM)")).toBeVisible()
  await page.locator("button[aria-haspopup='listbox']").click()
  const option = page.getByRole("option").last()
  await option.scrollIntoViewIfNeeded()
  const box = await option.boundingBox()
  if (!box) throw new Error("option has no box")
  const onTop = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest("[role=option]") !== null, {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  })
  expect(onTop).toBe(true)
})

// I have nothing but my burger and I want nothing more
test("JSON diff lists structural changes from the sample", async ({ page }) => {
  await page.goto("/json-diff")
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(page.getByText("$.version")).toBeVisible()
  await expect(page.getByText("$.tools[2]")).toBeVisible()
  await expect(page.getByText("$.private")).toBeVisible()
  await expectAccessible(page)
})

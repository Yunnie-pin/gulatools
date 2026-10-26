import type { Page } from "@playwright/test"
import { expect, expectAccessible, test } from "./fixtures"

const status = (page: Page) => page.locator("div[role=status]")

test("JWT decodes, verifies and signs", async ({ page }) => {
  await page.goto("/jwt")
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(page.getByText("Masih berlaku")).toBeVisible()
  await expect(status(page)).toContainText("Signature valid")
  await page.getByLabel("Secret").fill("salah")
  await expect(status(page)).toContainText("Signature tidak valid")
  await expectAccessible(page)

  await page.getByText("Sign", { exact: true }).click()
  await page.getByLabel("Secret").fill("gula-rahasia")
  const token = await page.locator("main .break-all").last().textContent()
  expect(token).toMatch(/^eyJ/)
  await page.getByText("Decode & verify", { exact: true }).click()
  await page.getByLabel("Token JWT").fill(token ?? "")
  await page.getByLabel("Secret").fill("gula-rahasia")
  await expect(status(page)).toContainText("Signature valid")
})

test("bcrypt hashes in a worker and verifies", async ({ page }) => {
  await page.goto("/bcrypt")
  await page.getByLabel("Password").first().fill("manis")
  await page.locator('input[type="range"]').fill("5")
  await page.getByRole("button", { name: "Generate hash" }).click()
  await expect(page.getByText("Selesai dalam")).toBeVisible()
  const hash = (await page.locator("code").first().textContent()) ?? ""
  await page.getByLabel("Password").nth(1).fill("manis")
  await page.getByLabel("Hash").fill(hash)
  await page.getByRole("button", { name: "Cek kecocokan" }).click()
  await expect(status(page)).toContainText("Password cocok")
  await expectAccessible(page)
})

test("argon2 hashes and verifies", async ({ page }) => {
  await page.goto("/argon2")
  await page.getByLabel("Password").first().fill("manis")
  await page.locator('input[type="range"]').first().fill("8")
  await page.getByRole("button", { name: "Generate hash" }).click()
  await expect(page.getByText("Selesai dalam")).toBeVisible({ timeout: 20_000 })
  const hash = (await page.locator("code").first().textContent()) ?? ""
  expect(hash).toMatch(/^\$argon2id\$v=19\$m=8192/)
  await page.getByLabel("Password").nth(1).fill("manis")
  await page.getByLabel("Hash").fill(hash)
  await page.getByRole("button", { name: "Cek kecocokan" }).click()
  await expect(status(page)).toContainText("Password cocok")
})

test("hash generator matches known vectors", async ({ page }) => {
  await page.goto("/hash")
  await page.getByLabel("Teks yang akan di-hash").fill("abc")
  await expect(page.locator("code").nth(2)).toHaveText(
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  )
})

test("HMAC matches RFC 4231", async ({ page }) => {
  await page.goto("/hmac")
  await page.getByLabel("Pesan").fill("what do ya want for nothing?")
  await page.getByLabel("Kunci rahasia").fill("Jefe")
  await expect(page.locator("code").first()).toHaveText(
    "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
  )
})

test("AES encrypts and decrypts", async ({ page }) => {
  await page.goto("/aes")
  await page.getByLabel("Teks").fill("rahasia gula")
  await page.getByLabel("Password").fill("kunci")
  await page.getByRole("button", { name: "Enkripsi" }).last().click()
  const cipher = page.locator("main p.font-mono")
  await expect(cipher).toHaveText(/^[A-Za-z0-9+/=]{40,}$/, { timeout: 15_000 })
  const encrypted = (await cipher.textContent()) ?? ""
  await page.getByText("Dekripsi", { exact: true }).first().click()
  await page.getByLabel("Data terenkripsi (Base64)").fill(encrypted)
  await page.getByRole("button", { name: "Dekripsi" }).last().click()
  await expect(cipher).toHaveText("rahasia gula", { timeout: 15_000 })
})

test("key generator produces PEM and JWK", async ({ page }) => {
  await page.goto("/keygen")
  await page.getByRole("button", { name: "Generate key pair" }).click()
  await expect(page.getByText("Algoritma JWT: ES256")).toBeVisible()
  await expect(page.locator("pre").first()).toContainText("-----BEGIN PUBLIC KEY-----")
})

test("password and UUID generators regenerate", async ({ page }) => {
  await page.goto("/password")
  const output = page.locator("main output").first()
  const first = await output.textContent()
  await page.getByRole("button", { name: "Generate ulang" }).click()
  await expect(output).not.toHaveText(first ?? "")
  await expect(page.getByText("Sangat kuat")).toBeVisible()

  await page.goto("/uuid")
  await page.getByText("UUID v7", { exact: true }).click()
  await page.getByLabel("Jumlah").fill("3")
  const lines = (await page.locator(".cm-content").textContent()) ?? ""
  expect(lines.match(/[0-9a-f]{8}-[0-9a-f]{4}-7/g)).toHaveLength(3)
})

test("TOTP reads an otpauth URI and shows a code with its QR", async ({ page }) => {
  await page.goto("/totp")
  await page.getByLabel(/^Secret/).fill("otpauth://totp/Gula:me%40gula.id?secret=JBSWY3DPEHPK3PXP&issuer=Gula")
  await expect(page.getByLabel(/^Secret/)).toHaveValue("JBSWY3DPEHPK3PXP")
  await expect(page.getByLabel("Issuer")).toHaveValue("Gula")
  await expect(page.getByLabel("Kode saat ini")).toHaveText(/^\d{3} \d{3}$/)
  await expect(page.getByRole("img", { name: /QR code/ })).toBeVisible()
  await expectAccessible(page)
  await page.getByLabel(/^Secret/).fill("not-base32!")
  await expect(page.getByRole("alert")).toContainText("Base32")
})

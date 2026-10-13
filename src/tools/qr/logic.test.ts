import QRCode from "qrcode"
import { describe, expect, it } from "vitest"
import { createQrSvg, decodeQr } from "./logic"

function render(text: string, scale = 4, margin = 4) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" })
  const size = (modules.size + margin * 2) * scale
  const pixels = new Uint8ClampedArray(size * size * 4).fill(255)
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (!modules.get(row, col)) continue
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const x = (col + margin) * scale + dx
          const y = (row + margin) * scale + dy
          pixels.fill(0, (y * size + x) * 4, (y * size + x) * 4 + 3)
        }
      }
    }
  }
  return { pixels, size }
}

describe("qr", () => {
  it("decodes what it encodes", () => {
    const { pixels, size } = render("https://gulatools.dev/jwt")
    expect(decodeQr(pixels, size, size)).toBe("https://gulatools.dev/jwt")
  })

  it("reports images without a code", () => {
    const blank = new Uint8ClampedArray(64 * 64 * 4).fill(255)
    expect(() => decodeQr(blank, 64, 64)).toThrow("Tidak ada QR code")
  })

  it("creates an svg", async () => {
    expect(await createQrSvg("halo", "M")).toMatch(/^<svg/)
  })

  it("requires text", async () => {
    await expect(createQrSvg("", "M")).rejects.toThrow("Isi teks")
  })
})

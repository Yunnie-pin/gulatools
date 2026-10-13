import jsQR from "jsqr"
import QRCode from "qrcode"

export type ErrorLevel = "L" | "M" | "Q" | "H"

const options = (level: ErrorLevel) => ({ errorCorrectionLevel: level, margin: 2 })

function requireText(text: string) {
  if (!text) throw new Error("Isi teks atau URL untuk dijadikan QR code")
}

export async function createQrPng(text: string, level: ErrorLevel, width = 1024): Promise<string> {
  requireText(text)
  return QRCode.toDataURL(text, { ...options(level), width })
}

export async function createQrSvg(text: string, level: ErrorLevel): Promise<string> {
  requireText(text)
  return QRCode.toString(text, { ...options(level), type: "svg" })
}

export function decodeQr(pixels: Uint8ClampedArray, width: number, height: number): string {
  const code = jsQR(pixels, width, height)
  if (!code) throw new Error("Tidak ada QR code yang terbaca di gambar ini")
  return code.data
}

export async function scanQr(image: Blob): Promise<string> {
  const bitmap = await createImageBitmap(image)
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Browser tidak mendukung pembacaan gambar")
  context.drawImage(bitmap, 0, 0)
  const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height)
  return decodeQr(data, bitmap.width, bitmap.height)
}

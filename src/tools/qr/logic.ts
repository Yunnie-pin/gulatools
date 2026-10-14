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

export type QrMatrix = { size: number; path: string }

export function createQrMatrix(text: string, level: ErrorLevel): QrMatrix {
  requireText(text)
  const { modules } = QRCode.create(text, { errorCorrectionLevel: level })
  let path = ""
  for (let y = 0; y < modules.size; y++) {
    for (let x = 0; x < modules.size; x++) {
      if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return { size: modules.size, path }
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

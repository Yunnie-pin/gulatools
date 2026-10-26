import jsQR from "jsqr"
import QRCode from "qrcode"
import { LocalizedError } from "@/i18n/errors"
import { type ErrorLevel, type QrMatrix, qrMatrix } from "@/lib/qr"

export type { ErrorLevel }

const options = (level: ErrorLevel) => ({ errorCorrectionLevel: level, margin: 2 })

function requireText(text: string) {
  if (!text) throw new LocalizedError("emptyQrText")
}

export async function createQrPng(text: string, level: ErrorLevel, width = 1024): Promise<string> {
  requireText(text)
  return QRCode.toDataURL(text, { ...options(level), width })
}

export async function createQrSvg(text: string, level: ErrorLevel): Promise<string> {
  requireText(text)
  return QRCode.toString(text, { ...options(level), type: "svg" })
}

export function createQrMatrix(text: string, level: ErrorLevel): QrMatrix {
  requireText(text)
  return qrMatrix(text, level)
}

export function decodeQr(pixels: Uint8ClampedArray, width: number, height: number): string {
  const code = jsQR(pixels, width, height)
  if (!code) throw new LocalizedError("noQrFound")
  return code.data
}

export async function scanQr(image: Blob): Promise<string> {
  const bitmap = await createImageBitmap(image)
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const context = canvas.getContext("2d")
  if (!context) throw new LocalizedError("noCanvas")
  context.drawImage(bitmap, 0, 0)
  const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height)
  return decodeQr(data, bitmap.width, bitmap.height)
}

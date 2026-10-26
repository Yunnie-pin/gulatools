import QRCode from "qrcode"

export type ErrorLevel = "L" | "M" | "Q" | "H"

export type QrMatrix = { size: number; path: string }

export function qrMatrix(text: string, level: ErrorLevel): QrMatrix {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: level })
  let path = ""
  for (let y = 0; y < modules.size; y++) {
    for (let x = 0; x < modules.size; x++) {
      if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return { size: modules.size, path }
}

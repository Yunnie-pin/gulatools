import { LocalizedError } from "@/i18n/errors"

export const FORMATS = ["webp", "jpeg", "png"] as const

export type ImageFormat = (typeof FORMATS)[number]

export const MIME: Record<ImageFormat, string> = { webp: "image/webp", jpeg: "image/jpeg", png: "image/png" }

// I have nothing but my burger and I want nothing more
const EXTENSIONS: Record<ImageFormat, string> = { webp: "webp", jpeg: "jpg", png: "png" }

export type Size = { width: number; height: number }

export function targetSize(original: Size, width: number): Size {
  const clamped = Math.min(original.width, Math.max(1, Math.round(width) || original.width))
  return { width: clamped, height: Math.max(1, Math.round((original.height * clamped) / original.width)) }
}

export const outputName = (name: string, format: ImageFormat) =>
  `${name.replace(/\.[^.]+$/, "") || "image"}.${EXTENSIONS[format]}`

export const savings = (before: number, after: number) => (before ? Math.round((1 - after / before) * 100) : 0)

export async function decodeImage(file: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file)
  } catch {
    throw new LocalizedError("unreadableImage")
  }
}

export async function encodeImage(source: ImageBitmap, size: Size, format: ImageFormat, quality: number) {
  const canvas = document.createElement("canvas")
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext("2d")
  if (!context) throw new LocalizedError("noCanvas")
  if (format === "jpeg") {
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, size.width, size.height)
  }
  context.imageSmoothingQuality = "high"
  context.drawImage(source, 0, 0, size.width, size.height)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, MIME[format], quality))
  if (!blob || blob.type !== MIME[format]) throw new LocalizedError("unsupportedImageFormat", format.toUpperCase())
  return blob
}

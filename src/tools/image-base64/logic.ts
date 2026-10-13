export const IMAGE_TYPES = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/gif", label: "GIF" },
  { value: "image/svg+xml", label: "SVG" },
] as const

export type ImageType = (typeof IMAGE_TYPES)[number]["value"]

export type ImageSnippets = {
  dataUrl: string
  base64: string
  css: string
  html: string
}

const DATA_URL = /^data:([\w.+-]+\/[\w.+-]+)?(;[\w-]+=[\w.-]+)*;base64,([A-Za-z0-9+/=\s]+)$/
const BASE64 = /^[A-Za-z0-9+/=\s]+$/

export function toDataUrl(input: string, fallbackType: ImageType): string {
  const text = input.trim()
  if (!text) throw new Error("Tempel data URI atau string Base64")
  const match = DATA_URL.exec(text)
  if (match) {
    if (match[1] && !match[1].startsWith("image/")) throw new Error(`Data URI bertipe ${match[1]}, bukan gambar`)
    return text.replace(/\s/g, "")
  }
  if (!BASE64.test(text)) throw new Error("Bukan data URI atau Base64 yang valid")
  return `data:${fallbackType};base64,${text.replace(/\s/g, "")}`
}

export function snippets(dataUrl: string): ImageSnippets {
  return {
    dataUrl,
    base64: dataUrl.slice(dataUrl.indexOf(",") + 1),
    css: `background-image: url("${dataUrl}");`,
    html: `<img src="${dataUrl}" alt="" />`,
  }
}

export const extensionFor = (type: string) => IMAGE_TYPES.find((t) => t.value === type)?.label.toLowerCase() ?? "png"

export const typeOf = (dataUrl: string) => /^data:([^;,]+)/.exec(dataUrl)?.[1] ?? "image/png"

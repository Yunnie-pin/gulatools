export type UrlMode = "component" | "uri" | "decode"

export function transformUrl(input: string, mode: UrlMode): string {
  if (mode === "component") return encodeURIComponent(input)
  if (mode === "uri") return encodeURI(input)
  try {
    return decodeURIComponent(input.replace(/\+/g, " "))
  } catch {
    throw new Error("Input berisi escape sequence (%XX) yang tidak valid")
  }
}

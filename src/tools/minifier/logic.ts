import { minify as minifyCss } from "csso"
import { minify as minifyJs } from "terser"
import { LocalizedError } from "@/i18n/errors"

export type MinifyLanguage = "js" | "css"

export async function minify(code: string, language: MinifyLanguage): Promise<string> {
  try {
    if (language === "css") return minifyCss(code).css
    const result = await minifyJs(code, { module: true, format: { comments: false } })
    return result.code ?? ""
  } catch (error) {
    const { message, line, col } = error as { message?: string; line?: number; col?: number }
    throw new LocalizedError("minifyFailed", line ? `${message} (${line}:${col})` : String(message ?? error))
  }
}

export const sizeOf = (text: string) => new TextEncoder().encode(text).length

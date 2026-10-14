import { LocalizedError } from "@/i18n/errors"

export type EscapeMode = "json" | "jsonUnescape" | "regex" | "shell" | "sql"

// I have nothing but my burger and I want nothing more
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g

function unescapeJson(input: string): string {
  const quoted = /^"[\s\S]*"$/.test(input) ? input : `"${input}"`
  try {
    return JSON.parse(quoted) as string
  } catch {
    throw new LocalizedError("invalidJsonString")
  }
}

export function escapeText(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json":
      return JSON.stringify(input).slice(1, -1)
    case "jsonUnescape":
      return unescapeJson(input)
    case "regex":
      return input.replace(REGEX_SPECIAL, "\\$&")
    case "shell":
      return `'${input.replace(/'/g, "'\\''")}'`
    case "sql":
      return `'${input.replace(/'/g, "''")}'`
  }
}

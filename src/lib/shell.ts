import { LocalizedError } from "@/i18n/errors"

const ANSI_C_ESCAPES: Record<string, string> = { n: "\n", t: "\t", r: "\r", "\\": "\\", "'": "'", '"': '"' }

export function tokenize(command: string): string[] {
  const text = command.replace(/\\\r?\n/g, " ")
  const tokens: string[] = []
  let current: string | null = null
  let i = 0

  const append = (chunk: string) => {
    current = (current ?? "") + chunk
  }

  while (i < text.length) {
    const char = text[i]!
    if (/\s/.test(char)) {
      if (current !== null) tokens.push(current)
      current = null
      i++
    } else if (char === "'") {
      const end = text.indexOf("'", i + 1)
      if (end < 0) throw new LocalizedError("unclosedQuote")
      append(text.slice(i + 1, end))
      i = end + 1
    } else if (char === "$" && text[i + 1] === "'") {
      let chunk = ""
      i += 2
      while (i < text.length && text[i] !== "'") {
        if (text[i] === "\\" && i + 1 < text.length) {
          chunk += ANSI_C_ESCAPES[text[i + 1]!] ?? text[i + 1]
          i += 2
        } else chunk += text[i++]
      }
      if (i >= text.length) throw new LocalizedError("unclosedQuote")
      append(chunk)
      i++
    } else if (char === '"') {
      let chunk = ""
      i++
      while (i < text.length && text[i] !== '"') {
        if (text[i] === "\\" && /["\\$`]/.test(text[i + 1] ?? "")) i++
        chunk += text[i++]
      }
      if (i >= text.length) throw new LocalizedError("unclosedQuote")
      append(chunk)
      i++
    } else if (char === "\\" && i + 1 < text.length) {
      append(text[i + 1]!)
      i += 2
    } else {
      append(char)
      i++
    }
  }
  if (current !== null) tokens.push(current)
  return tokens
}

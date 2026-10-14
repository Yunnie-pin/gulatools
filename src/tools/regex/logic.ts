export const FLAGS = ["g", "i", "m", "s", "u"] as const

export type RegexFlag = (typeof FLAGS)[number]

export const MAX_MATCHES = 1000

export type RegexInput = {
  pattern: string
  flags: string
  text: string
  replacement: string | null
}

export type RegexMatch = {
  index: number
  text: string
  groups: (string | undefined)[]
  named: Record<string, string | undefined>
}

export type RegexResult = {
  matches: RegexMatch[]
  truncated: boolean
  replaced: string | null
}

export function runRegex({ pattern, flags, text, replacement }: RegexInput): RegexResult {
  const regex = new RegExp(pattern, flags)
  const iterator = text.matchAll(new RegExp(pattern, regex.global ? flags : `${flags}g`))
  const limit = regex.global ? MAX_MATCHES : 1
  const matches: RegexMatch[] = []

  for (const match of iterator) {
    if (matches.length === limit) break
    matches.push({
      index: match.index,
      text: match[0],
      groups: match.slice(1),
      named: { ...match.groups },
    })
  }

  return {
    matches,
    truncated: regex.global && matches.length === MAX_MATCHES,
    replaced: replacement === null ? null : text.replace(regex, replacement),
  }
}

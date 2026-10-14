import { LocalizedError } from "@/i18n/errors"
export const CHARSETS = {
  lower: { chars: "abcdefghijklmnopqrstuvwxyz" },
  upper: { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  digits: { chars: "0123456789" },
  symbols: { chars: "!@#$%^&*()-_=+[]{};:,.<>?/~" },
} as const

export type CharsetId = keyof typeof CHARSETS

export const CHARSET_IDS = Object.keys(CHARSETS) as CharsetId[]

export const MIN_LENGTH = 4
export const MAX_LENGTH = 128

export type PasswordOptions = {
  length: number
  sets: Record<CharsetId, boolean>
  excludeAmbiguous: boolean
}

const AMBIGUOUS = /[O0oIl1|]/g

function setsFor({ sets, excludeAmbiguous }: PasswordOptions): string[] {
  return CHARSET_IDS.filter((id) => sets[id]).map((id) =>
    excludeAmbiguous ? CHARSETS[id].chars.replace(AMBIGUOUS, "") : CHARSETS[id].chars,
  )
}

export function randomInt(max: number): number {
  const limit = Math.floor(0x1_0000_0000 / max) * max
  const buffer = new Uint32Array(1)
  while (true) {
    crypto.getRandomValues(buffer)
    const value = buffer[0]!
    if (value < limit) return value % max
  }
}

const pick = (chars: string) => chars[randomInt(chars.length)]!

export function generatePassword(options: PasswordOptions): string {
  const sets = setsFor(options)
  if (!sets.length) throw new LocalizedError("noCharset")
  const pool = sets.join("")
  const length = Math.max(options.length, sets.length)
  const chars = [...sets.map(pick), ...Array.from({ length: length - sets.length }, () => pick(pool))]
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j]!, chars[i]!]
  }
  return chars.join("")
}

export const entropyBits = (options: PasswordOptions) =>
  options.length * Math.log2(setsFor(options).join("").length || 1)

export type StrengthLevel = ReturnType<typeof strength>["level"]

export function strength(bits: number) {
  if (bits < 40) return { level: "weak", tone: "danger" } as const
  if (bits < 64) return { level: "fair", tone: "neutral" } as const
  if (bits < 100) return { level: "strong", tone: "success" } as const
  return { level: "veryStrong", tone: "success" } as const
}

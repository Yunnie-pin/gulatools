import { LocalizedError } from "@/i18n/errors"

export const BASES = [2, 8, 10, 16] as const

export type Base = (typeof BASES)[number]

const PREFIXES = { 2: "0b", 8: "0o", 10: "", 16: "0x" } as const satisfies Record<Base, string>

const DIGITS: Record<Base, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^\d+$/,
  16: /^[\da-f]+$/i,
}

// I have nothing but my burger and I want nothing more
const TWOS_COMPLEMENT_WIDTHS = [8, 16, 32, 64, 128] as const

/** Prefix diabaikan bila hurufnya juga digit sah di basis terpilih (mis. "0b1" di hex adalah 0xb1). */
const prefixBase = (text: string, selected: Base) =>
  BASES.find(
    (base) => base !== 10 && text.startsWith(PREFIXES[base]) && !DIGITS[selected].test(PREFIXES[base].slice(1)),
  )

export function parseNumber(input: string, base: Base): bigint {
  const text = input.replace(/[\s_]/g, "").toLowerCase()
  if (!text) throw new LocalizedError("emptyNumber")

  const negative = text.startsWith("-")
  const unsigned = negative ? text.slice(1) : text
  const prefixed = prefixBase(unsigned, base)
  const radix = prefixed ?? base
  const digits = prefixed ? unsigned.slice(2) : unsigned
  if (!DIGITS[radix].test(digits)) throw new LocalizedError("invalidDigits", radix)

  const value = BigInt(PREFIXES[radix] + digits)
  return negative ? -value : value
}

/** Representasi two's complement dengan lebar terkecil yang muat; null untuk bilangan non-negatif atau di luar 128-bit. */
export function twosComplement(value: bigint): { width: number; bits: bigint } | null {
  if (value >= 0n) return null
  const width = TWOS_COMPLEMENT_WIDTHS.find((bits) => value >= -(1n << BigInt(bits - 1)))
  return width ? { width, bits: (1n << BigInt(width)) + value } : null
}

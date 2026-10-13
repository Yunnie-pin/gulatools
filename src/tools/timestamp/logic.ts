export type TimestampUnit = "detik" | "milidetik" | "mikrodetik" | "nanodetik" | "tanggal"

export type ParsedTimestamp = { date: Date; unit: TimestampUnit }

const NUMERIC = /^-?\d+(\.\d+)?$/

const EPOCH_UNITS: [limit: number, unit: TimestampUnit, toMs: number][] = [
  [1e11, "detik", 1000],
  [1e14, "milidetik", 1],
  [1e17, "mikrodetik", 1e-3],
  [Number.POSITIVE_INFINITY, "nanodetik", 1e-6],
]

export function parseTimestamp(input: string): ParsedTimestamp {
  const text = input.trim()
  if (!text) throw new Error("Masukkan Unix timestamp atau tanggal")

  if (NUMERIC.test(text)) {
    const value = Number(text)
    const [, unit, toMs] = EPOCH_UNITS.find(([limit]) => Math.abs(value) < limit) ?? EPOCH_UNITS[0]!
    const date = new Date(value * toMs)
    if (Number.isNaN(date.getTime())) throw new Error("Di luar rentang tanggal yang didukung")
    return { date, unit }
  }

  const ms = Date.parse(text)
  if (Number.isNaN(ms)) throw new Error("Format tidak dikenali. Contoh: 1760000000, 2026-10-13T08:00:00Z")
  return { date: new Date(ms), unit: "tanggal" }
}

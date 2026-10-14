import { LocalizedError } from "@/i18n/errors"
export type TimestampUnit = "seconds" | "milliseconds" | "microseconds" | "nanoseconds" | "date"

export type ParsedTimestamp = { date: Date; unit: TimestampUnit }

const NUMERIC = /^-?\d+(\.\d+)?$/

const EPOCH_UNITS: [limit: number, unit: TimestampUnit, toMs: number][] = [
  [1e11, "seconds", 1000],
  [1e14, "milliseconds", 1],
  [1e17, "microseconds", 1e-3],
  [Number.POSITIVE_INFINITY, "nanoseconds", 1e-6],
]

export function parseTimestamp(input: string): ParsedTimestamp {
  const text = input.trim()
  if (!text) throw new LocalizedError("emptyTimestamp")

  if (NUMERIC.test(text)) {
    const value = Number(text)
    const [, unit, toMs] = EPOCH_UNITS.find(([limit]) => Math.abs(value) < limit) ?? EPOCH_UNITS[0]!
    const date = new Date(value * toMs)
    if (Number.isNaN(date.getTime())) throw new LocalizedError("dateOutOfRange")
    return { date, unit }
  }

  const ms = Date.parse(text)
  if (Number.isNaN(ms)) throw new LocalizedError("unknownDateFormat")
  return { date: new Date(ms), unit: "date" }
}

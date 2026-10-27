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

export function isTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone })
    return true
  } catch {
    return false
  }
}

export const zoneOffset = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")
    ?.value.replace(/^GMT$/, "GMT+00:00")
    .replace("GMT", "UTC") ?? "UTC+00:00"

export const formatInZone = (date: Date, timeZone: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { timeZone, dateStyle: "full", timeStyle: "medium" }).format(date)

export type Duration = {
  negative: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

export function durationBetween(from: Date, to: Date): Duration {
  const totalSeconds = Math.round((to.getTime() - from.getTime()) / 1000)
  const abs = Math.abs(totalSeconds)
  return {
    negative: totalSeconds < 0,
    days: Math.floor(abs / 86400),
    hours: Math.floor((abs % 86400) / 3600),
    minutes: Math.floor((abs % 3600) / 60),
    seconds: abs % 60,
    totalSeconds,
  }
}

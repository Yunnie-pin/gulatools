import type { Locale } from "@/i18n/locale"

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
]

export function relativeTime(date: Date, locale: Locale, now = new Date()): string {
  const seconds = (date.getTime() - now.getTime()) / 1000
  const [unit, size] = UNITS.find(([, size]) => Math.abs(seconds) >= size) ?? ["second", 1]
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(Math.round(seconds / size), unit)
}

export const formatDateTime = (date: Date, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "long" }).format(date)

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
]

const relative = new Intl.RelativeTimeFormat("id", { numeric: "auto" })

export function relativeTime(date: Date, now = new Date()): string {
  const seconds = (date.getTime() - now.getTime()) / 1000
  const [unit, size] = UNITS.find(([, size]) => Math.abs(seconds) >= size) ?? ["second", 1]
  return relative.format(Math.round(seconds / size), unit)
}

const dateTime = new Intl.DateTimeFormat("id", { dateStyle: "full", timeStyle: "long" })

export const formatDateTime = (date: Date) => dateTime.format(date)

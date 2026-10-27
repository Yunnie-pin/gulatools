import { describe, expect, it } from "vitest"
import { durationBetween, formatInZone, isTimeZone, parseTimestamp, zoneOffset } from "./logic"

const iso = (input: string) => parseTimestamp(input).date.toISOString()

describe("parseTimestamp", () => {
  it("reads seconds", () => {
    expect(parseTimestamp("1760000000")).toEqual({ date: new Date("2025-10-09T08:53:20Z"), unit: "seconds" })
  })

  it("reads milliseconds", () => {
    expect(parseTimestamp("1760000000123").unit).toBe("milliseconds")
    expect(iso("1760000000123")).toBe("2025-10-09T08:53:20.123Z")
  })

  it("reads micro and nanoseconds", () => {
    expect(iso("1760000000123456")).toBe("2025-10-09T08:53:20.123Z")
    expect(parseTimestamp("1760000000123456789").unit).toBe("nanoseconds")
  })

  it("reads ISO dates", () => {
    expect(parseTimestamp("2026-10-13T08:00:00Z")).toEqual({ date: new Date("2026-10-13T08:00:00Z"), unit: "date" })
  })

  it("handles negative epochs", () => {
    expect(iso("-86400")).toBe("1969-12-31T00:00:00.000Z")
  })

  it("rejects values outside the date range", () => {
    expect(() => parseTimestamp("9".repeat(25))).toThrow("rentang")
  })

  it("rejects nonsense", () => {
    expect(() => parseTimestamp("kemarin sore")).toThrow("tidak dikenali")
  })
})

describe("time zones", () => {
  const date = new Date("2026-01-15T12:00:00Z")

  it("validates IANA zone names", () => {
    expect(isTimeZone("Asia/Jakarta")).toBe(true)
    expect(isTimeZone("Mars/Olympus")).toBe(false)
  })

  it("reports the UTC offset in effect on that date, following daylight saving", () => {
    expect(zoneOffset(date, "Asia/Jakarta")).toBe("UTC+07:00")
    expect(zoneOffset(date, "America/New_York")).toBe("UTC-05:00")
    expect(zoneOffset(new Date("2026-07-15T12:00:00Z"), "America/New_York")).toBe("UTC-04:00")
    expect(zoneOffset(date, "UTC")).toBe("UTC+00:00")
  })

  it("formats the wall-clock time in the target zone", () => {
    expect(formatInZone(date, "Asia/Kolkata", "en")).toContain("5:30:00 PM")
  })
})

describe("durationBetween", () => {
  it("breaks the gap into days, hours, minutes and seconds", () => {
    expect(durationBetween(new Date("2026-01-01T00:00:00Z"), new Date("2026-01-03T04:05:06Z"))).toEqual({
      negative: false,
      days: 2,
      hours: 4,
      minutes: 5,
      seconds: 6,
      totalSeconds: 187506,
    })
  })

  it("marks a target in the past as negative", () => {
    expect(durationBetween(new Date(60_000), new Date(0))).toMatchObject({
      negative: true,
      minutes: 1,
      totalSeconds: -60,
    })
  })
})

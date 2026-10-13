import { describe, expect, it } from "vitest"
import { parseTimestamp } from "./logic"

const iso = (input: string) => parseTimestamp(input).date.toISOString()

describe("parseTimestamp", () => {
  it("reads seconds", () => {
    expect(parseTimestamp("1760000000")).toEqual({ date: new Date("2025-10-09T08:53:20Z"), unit: "detik" })
  })

  it("reads milliseconds", () => {
    expect(parseTimestamp("1760000000123").unit).toBe("milidetik")
    expect(iso("1760000000123")).toBe("2025-10-09T08:53:20.123Z")
  })

  it("reads micro and nanoseconds", () => {
    expect(iso("1760000000123456")).toBe("2025-10-09T08:53:20.123Z")
    expect(parseTimestamp("1760000000123456789").unit).toBe("nanodetik")
  })

  it("reads ISO dates", () => {
    expect(parseTimestamp("2026-10-13T08:00:00Z")).toEqual({ date: new Date("2026-10-13T08:00:00Z"), unit: "tanggal" })
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

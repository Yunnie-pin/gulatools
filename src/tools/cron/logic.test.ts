import { describe, expect, it } from "vitest"
import { explainCron } from "./logic"

describe("explainCron", () => {
  const from = new Date("2026-10-13T10:07:00")

  it("describes the schedule in Indonesian", () => {
    expect(explainCron("*/15 9-17 * * 1-5", { count: 1, from }).description).toBe(
      "Setiap 15 menit, diantara 09:00 dan 17:59, Senin sampai Jumat",
    )
  })

  it("describes the schedule in English", () => {
    expect(explainCron("0 9 * * 1-5", { locale: "en", count: 1, from }).description).toBe(
      "At 09:00, Monday through Friday",
    )
  })

  it("describes the schedule in Japanese once the cronstrue locale is loaded", () => {
    expect(explainCron("0 9 * * 1-5", { locale: "ja", count: 1, from }).description).toContain("月曜日 から 金曜日")
  })

  it("lists upcoming runs in order", () => {
    const runs = explainCron("*/15 * * * *", { count: 3, from }).nextRuns.map((d) => d.toTimeString().slice(0, 5))
    expect(runs).toEqual(["10:15", "10:30", "10:45"])
  })

  it("supports a seconds field", () => {
    expect(explainCron("*/10 * * * * *", { count: 2, from }).nextRuns).toHaveLength(2)
  })

  it("rejects out of range values", () => {
    expect(() => explainCron("61 * * * *")).toThrow(/^Ekspresi cron tidak valid: minutes/)
  })
})

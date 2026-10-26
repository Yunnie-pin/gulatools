import { describe, expect, it } from "vitest"
import { checkRange } from "./logic"

describe("checkRange", () => {
  it("expands caret ranges and checks each version like npm does", () => {
    const report = checkRange("^1.2.0", "1.1.9\n1.2.0\n1.9.3\n2.0.0", false)
    expect(report.normalized).toBe(">=1.2.0 <2.0.0-0")
    expect(report.min).toBe("1.2.0")
    expect(report.best).toBe("1.9.3")
    expect(report.checks.map((check) => check.satisfies)).toEqual([false, true, true, false])
  })

  it("treats caret on 0.x as locking the minor version", () => {
    const report = checkRange("^0.2.3", "0.2.9\n0.3.0", false)
    expect(report.checks.map((check) => check.satisfies)).toEqual([true, false])
  })

  it("excludes prereleases unless asked, matching npm install behavior", () => {
    expect(checkRange(">=1.0.0", "2.0.0-beta.1", false).checks[0]?.satisfies).toBe(false)
    expect(checkRange(">=1.0.0", "2.0.0-beta.1", true).checks[0]?.satisfies).toBe(true)
  })

  it("marks invalid versions instead of failing the whole list", () => {
    const report = checkRange("~1.2", "1.2.7\nnot-a-version\n", false)
    expect(report.checks).toEqual([
      { version: "1.2.7", valid: true, satisfies: true },
      { version: "not-a-version", valid: false, satisfies: false },
    ])
  })

  it("rejects ranges npm would not accept", () => {
    expect(() => checkRange(">=1.0.0 <<2", "", false)).toThrow("range")
  })
})

import { describe, expect, it } from "vitest"
import { MAX_MATCHES, runRegex } from "./logic"

const run = (pattern: string, flags: string, text: string, replacement: string | null = null) =>
  runRegex({ pattern, flags, text, replacement })

describe("runRegex", () => {
  it("finds every match with its index when global", () => {
    const { matches } = run("\\d+", "g", "a1 b22 c333")
    expect(matches.map((m) => [m.index, m.text])).toEqual([
      [1, "1"],
      [4, "22"],
      [8, "333"],
    ])
  })

  it("stops after the first match without g", () => {
    expect(run("\\d", "", "1 2 3").matches).toHaveLength(1)
  })

  it("returns numbered and named groups", () => {
    const [match] = run("(?<user>\\w+)@(\\w+)", "", "gula@manis").matches
    expect(match?.groups).toEqual(["gula", "manis"])
    expect(match?.named).toEqual({ user: "gula" })
  })

  it("replaces with group references", () => {
    expect(run("(\\w+)@(\\w+)", "g", "gula@manis", "$2@$1").replaced).toBe("manis@gula")
  })

  it("handles zero-length matches without looping forever", () => {
    expect(run("", "g", "abc").matches).toHaveLength(4)
  })

  it("caps the number of matches", () => {
    const result = run(".", "g", "x".repeat(MAX_MATCHES + 10))
    expect(result.matches).toHaveLength(MAX_MATCHES)
    expect(result.truncated).toBe(true)
  })

  it("throws on invalid patterns", () => {
    expect(() => run("(", "", "x")).toThrow(SyntaxError)
  })
})

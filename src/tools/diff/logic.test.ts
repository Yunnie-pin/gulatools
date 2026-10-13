import { describe, expect, it } from "vitest"
import { diffTexts, summarize, toPatch } from "./logic"

describe("diffTexts", () => {
  it("counts changed lines", () => {
    const changes = diffTexts("a\nb\nc\n", "a\nB\nc\nd\n", "lines", false)
    expect(summarize(changes)).toEqual({ added: 2, removed: 1 })
  })

  it("can ignore whitespace-only line changes", () => {
    expect(summarize(diffTexts("a\n  b\n", "a\nb\n", "lines", true))).toEqual({ added: 0, removed: 0 })
  })

  it("diffs words", () => {
    const changes = diffTexts("gula manis sekali", "gula pahit sekali", "words", true)
    expect(changes.filter((c) => c.added).map((c) => c.value)).toEqual(["pahit"])
  })

  it("diffs characters", () => {
    expect(summarize(diffTexts("kucing", "kacang", "chars", false))).toEqual({ added: 2, removed: 2 })
  })
})

describe("toPatch", () => {
  it("creates a unified diff", () => {
    const patch = toPatch("a\n", "b\n")
    expect(patch).toContain("--- original")
    expect(patch).toContain("-a\n+b")
  })
})

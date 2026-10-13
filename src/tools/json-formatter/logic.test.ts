import { describe, expect, it } from "vitest"
import { formatJson, minifyJson } from "./logic"

describe("formatJson", () => {
  it("indents with spaces", () => {
    expect(formatJson('{"a":[1,2]}', 2)).toBe('{\n  "a": [\n    1,\n    2\n  ]\n}')
  })

  it("indents with tabs", () => {
    expect(formatJson('{"a":1}', "\t")).toBe('{\n\t"a": 1\n}')
  })

  it("keeps unicode intact", () => {
    expect(formatJson('{"gula":"manis 🍬"}', 2)).toContain("manis 🍬")
  })

  it("throws on invalid input", () => {
    expect(() => formatJson("{a:1}", 2)).toThrow(SyntaxError)
  })
})

describe("minifyJson", () => {
  it("removes whitespace", () => {
    expect(minifyJson('{\n  "a": [1, 2]\n}')).toBe('{"a":[1,2]}')
  })

  it("throws on empty input", () => {
    expect(() => minifyJson("")).toThrow(SyntaxError)
  })
})

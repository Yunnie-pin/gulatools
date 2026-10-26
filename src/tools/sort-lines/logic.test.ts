import { describe, expect, it } from "vitest"
import { type LineOptions, processLines } from "./logic"

const options = (overrides: Partial<LineOptions>): LineOptions => ({
  order: "keep",
  unique: false,
  ignoreCase: false,
  trim: false,
  removeEmpty: false,
  ...overrides,
})

describe("processLines", () => {
  it("sorts numbers naturally so file10 comes after file2", () => {
    expect(processLines("file10\nfile2\nfile1", options({ order: "asc" }))).toBe("file1\nfile2\nfile10")
    expect(processLines("b\na\nc", options({ order: "desc" }))).toBe("c\nb\na")
  })

  it("keeps the first occurrence when removing duplicates, preserving original order", () => {
    expect(processLines("b\na\nb\nc\na", options({ unique: true }))).toBe("b\na\nc")
  })

  it("treats case variants as duplicates only when asked", () => {
    expect(processLines("Gula\ngula", options({ unique: true }))).toBe("Gula\ngula")
    expect(processLines("Gula\ngula", options({ unique: true, ignoreCase: true }))).toBe("Gula")
  })

  it("trims before deduplicating so trailing spaces do not hide duplicates", () => {
    expect(processLines("a \n a\n\nb", options({ trim: true, unique: true, removeEmpty: true }))).toBe("a\nb")
  })

  it("handles Windows line endings", () => {
    expect(processLines("b\r\na", options({ order: "asc" }))).toBe("a\nb")
  })

  it("reverses and shuffles without losing lines", () => {
    expect(processLines("1\n2\n3", options({ order: "reverse" }))).toBe("3\n2\n1")
    expect(processLines("1\n2\n3", options({ order: "shuffle" }), () => 0)).toBe("2\n3\n1")
  })
})

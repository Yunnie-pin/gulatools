import { describe, expect, it } from "vitest"
import { compareJson, diffJson, toReport } from "./logic"

describe("diffJson", () => {
  it("ignores key order and formatting, unlike a text diff", () => {
    expect(compareJson('{"a":1,"b":2}', '{\n  "b": 2,\n  "a": 1\n}')).toEqual([])
  })

  it("reports added, removed and changed values by path", () => {
    expect(diffJson({ a: 1, b: { c: true }, gone: 0 }, { a: 2, b: { c: true, d: null } })).toEqual([
      { kind: "changed", path: "$.a", before: 1, after: 2 },
      { kind: "added", path: "$.b.d", after: null },
      { kind: "removed", path: "$.gone", before: 0 },
    ])
  })

  it("compares arrays by index and reports trailing items", () => {
    expect(diffJson([1, 2, 3], [1, 5])).toEqual([
      { kind: "changed", path: "$[1]", before: 2, after: 5 },
      { kind: "removed", path: "$[2]", before: 3 },
    ])
  })

  it("treats a type change as one change instead of diffing inside it", () => {
    expect(diffJson({ a: [1] }, { a: { 0: 1 } })).toEqual([
      { kind: "changed", path: "$.a", before: [1], after: { 0: 1 } },
    ])
  })

  it("quotes keys that are not identifiers so paths stay valid JSONPath", () => {
    expect(diffJson({}, { "content-type": "x" })[0]?.path).toBe('$["content-type"]')
  })

  it("says which side has invalid JSON", () => {
    expect(() => compareJson("{", "{}")).toThrow("asli")
    expect(() => compareJson("{}", "{")).toThrow("diubah")
  })
})

describe("toReport", () => {
  it("writes one line per change", () => {
    expect(toReport(diffJson({ a: 1, b: 2 }, { a: 3, c: "x" }))).toBe('~ $.a: 1 → 3\n- $.b: 2\n+ $.c: "x"')
  })
})

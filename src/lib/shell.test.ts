import { describe, expect, it } from "vitest"
import { tokenize } from "./shell"

describe("tokenize", () => {
  it("handles quotes, escapes and line continuations the way bash does", () => {
    expect(tokenize(`curl 'a b' "c \\"d\\"" e\\ f \\\n  -s`)).toEqual(["curl", "a b", 'c "d"', "e f", "-s"])
  })

  it("decodes $'…' strings from Chrome's Copy as cURL", () => {
    expect(tokenize("curl $'line\\none\\'s'")).toEqual(["curl", "line\none's"])
  })

  it("rejects unclosed quotes", () => {
    expect(() => tokenize("curl 'oops")).toThrow("tidak ditutup")
  })
})

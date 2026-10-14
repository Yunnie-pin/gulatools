import { describe, expect, it } from "vitest"
import { encodeEntities } from "./logic"

describe("encodeEntities", () => {
  it("escapes every character that can break out of HTML text or attributes", () => {
    expect(encodeEntities(`<a href="x" title='y'>&</a>`, false)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    )
  })

  it("leaves non-ASCII alone by default", () => {
    expect(encodeEntities("gula © manis", false)).toBe("gula © manis")
  })

  it("can also escape non-ASCII, keeping astral characters as one entity", () => {
    expect(encodeEntities("é 🍬 <", true)).toBe("&#xe9; &#x1f36c; &lt;")
  })

  it("keeps line breaks and tabs readable", () => {
    expect(encodeEntities("a\n\tb", true)).toBe("a\n\tb")
  })
})

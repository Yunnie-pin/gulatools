import { describe, expect, it } from "vitest"
import { transformUrl } from "./logic"

describe("transformUrl", () => {
  it("encodes a component including reserved characters", () => {
    expect(transformUrl("a b&c=d/é", "component")).toBe("a%20b%26c%3Dd%2F%C3%A9")
  })

  it("encodes a full uri keeping its structure", () => {
    expect(transformUrl("https://x.id/a b?q=é", "uri")).toBe("https://x.id/a%20b?q=%C3%A9")
  })

  it("decodes percent escapes and plus signs", () => {
    expect(transformUrl("gula+manis%20%F0%9F%8D%AC", "decode")).toBe("gula manis 🍬")
  })

  it("rejects malformed escapes", () => {
    expect(() => transformUrl("%E0%A4%A", "decode")).toThrow("tidak valid")
  })
})

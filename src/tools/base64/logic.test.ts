import { describe, expect, it } from "vitest"
import { decodeBase64, encodeBase64 } from "./logic"

describe("base64", () => {
  it("encodes ascii", () => {
    expect(encodeBase64("hello")).toBe("aGVsbG8=")
  })

  it("round-trips unicode", () => {
    const text = "gula manis 🍬 — ünïcödé"
    expect(decodeBase64(encodeBase64(text))).toBe(text)
  })

  it("encodes url-safe without padding", () => {
    expect(encodeBase64("??>>", true)).toBe("Pz8-Pg")
  })

  it("decodes url-safe and unpadded input", () => {
    expect(decodeBase64("Pz8-Pg")).toBe("??>>")
  })

  it("ignores whitespace", () => {
    expect(decodeBase64("aGVs\nbG8=")).toBe("hello")
  })

  it("rejects invalid input", () => {
    expect(() => decodeBase64("***")).toThrow("Base64")
  })

  it("rejects binary that is not utf-8", () => {
    expect(() => decodeBase64("/w==")).toThrow("UTF-8")
  })
})

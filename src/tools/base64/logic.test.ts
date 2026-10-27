import { describe, expect, it } from "vitest"
import { decodeText, encodeText } from "./logic"

describe("base64", () => {
  it("encodes ascii", () => {
    expect(encodeText("hello", "base64")).toBe("aGVsbG8=")
  })

  it("round-trips unicode", () => {
    const text = "gula manis 🍬 — ünïcödé"
    expect(decodeText(encodeText(text, "base64"), "base64")).toBe(text)
  })

  it("encodes url-safe without padding", () => {
    expect(encodeText("??>>", "base64", true)).toBe("Pz8-Pg")
  })

  it("decodes url-safe and unpadded input", () => {
    expect(decodeText("Pz8-Pg", "base64")).toBe("??>>")
  })

  it("ignores whitespace", () => {
    expect(decodeText("aGVs\nbG8=", "base64")).toBe("hello")
  })

  it("rejects invalid input", () => {
    expect(() => decodeText("***", "base64")).toThrow("Base64")
  })

  it("rejects binary that is not utf-8", () => {
    expect(() => decodeText("/w==", "base64")).toThrow("UTF-8")
  })
})

describe("other encodings", () => {
  it.each(["base32", "base58", "hex"] as const)("round-trips unicode text through %s", (encoding) => {
    const text = "gula manis 🍬"
    expect(decodeText(encodeText(text, encoding), encoding)).toBe(text)
  })

  it("pads Base32 like RFC 4648 and writes lowercase hex", () => {
    expect(encodeText("hi", "base32")).toBe("NBUQ====")
    expect(encodeText("hi", "hex")).toBe("6869")
  })
})

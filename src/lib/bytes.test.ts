import { describe, expect, it } from "vitest"
import { base32ToBytes, base58ToBytes, bytesToBase32, bytesToBase58, bytesToHex, hexToBytes } from "./bytes"

const text = (bytes: Uint8Array) => new TextDecoder().decode(bytes)
const utf8 = (value: string) => new TextEncoder().encode(value)

describe("base32", () => {
  // RFC 4648 section 10 test vectors
  it.each([
    ["f", "MY======"],
    ["fo", "MZXQ===="],
    ["foobar", "MZXW6YTBOI======"],
  ])("encodes %s as %s with padding", (input, expected) => {
    expect(bytesToBase32(utf8(input), true)).toBe(expected)
    expect(text(base32ToBytes(expected))).toBe(input)
  })

  it("tolerates spaces, dashes and lowercase as authenticator apps display them", () => {
    expect(text(base32ToBytes("mzxw-6ytb oi"))).toBe("foobar")
  })

  it("rejects characters outside the alphabet", () => {
    expect(() => base32ToBytes("ABC1")).toThrow("Base32")
  })
})

describe("base58", () => {
  it("matches the Bitcoin alphabet vectors", () => {
    expect(bytesToBase58(utf8("Hello World!"))).toBe("2NEpo7TZRRrLZSi2U")
    expect(text(base58ToBytes("2NEpo7TZRRrLZSi2U"))).toBe("Hello World!")
  })

  it("keeps leading zero bytes as leading 1s, which plain number conversion would drop", () => {
    expect(bytesToBase58(new Uint8Array([0, 0, 1]))).toBe("112")
    expect([...base58ToBytes("112")]).toEqual([0, 0, 1])
    expect(bytesToBase58(new Uint8Array())).toBe("")
  })

  it("rejects look-alike characters that Base58 leaves out", () => {
    expect(() => base58ToBytes("0OIl")).toThrow("Base58")
  })
})

describe("hex", () => {
  it("accepts the separators and prefixes found in dumps and code", () => {
    expect(text(hexToBytes("48 65:6C-6c 0x6f"))).toBe("Hello")
    expect(bytesToHex(utf8("Hi"))).toBe("4869")
  })

  it("rejects odd lengths and non-hex digits", () => {
    expect(() => hexToBytes("abc")).toThrow("hex")
    expect(() => hexToBytes("zz")).toThrow("hex")
  })
})

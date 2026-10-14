import { describe, expect, it } from "vitest"
import { parseNumber, twosComplement } from "./logic"

describe("parseNumber", () => {
  it("reads digits in the selected base", () => {
    expect(parseNumber("ff", 16)).toBe(255n)
    expect(parseNumber("777", 8)).toBe(511n)
    expect(parseNumber("1010", 2)).toBe(10n)
  })

  it("lets a prefix override the selected base so pasted literals just work", () => {
    expect(parseNumber("0xFF", 10)).toBe(255n)
    expect(parseNumber("0b1010", 8)).toBe(10n)
    expect(parseNumber("-0o17", 2)).toBe(-15n)
  })

  it("keeps hex digits that look like a binary prefix when hex is selected", () => {
    expect(parseNumber("0b1", 16)).toBe(0xb1n)
    expect(parseNumber("0x1f", 16)).toBe(31n)
  })

  it("ignores digit separators", () => {
    expect(parseNumber("1_000 000", 10)).toBe(1000000n)
  })

  it("stays exact beyond Number.MAX_SAFE_INTEGER", () => {
    expect(parseNumber("18446744073709551615", 10).toString(16)).toBe("ffffffffffffffff")
  })

  it("rejects digits outside the base", () => {
    expect(() => parseNumber("12", 2)).toThrow("basis 2")
    expect(() => parseNumber("", 10)).toThrow("Masukkan")
  })
})

describe("twosComplement", () => {
  it("picks the smallest width that fits", () => {
    expect(twosComplement(-1n)).toEqual({ width: 8, bits: 0xffn })
    expect(twosComplement(-129n)).toEqual({ width: 16, bits: 0xff7fn })
  })

  it("only applies to negative values", () => {
    expect(twosComplement(5n)).toBeNull()
  })
})

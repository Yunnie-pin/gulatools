import { describe, expect, it } from "vitest"
import { bitOf, parseMode, specialBit, toOctal, toSymbolic } from "./logic"

describe("parseMode", () => {
  it("reads octal modes, with or without special bits", () => {
    expect(parseMode("755")).toBe(0o755)
    expect(parseMode("4755")).toBe(0o4755)
  })

  it("reads symbolic modes as printed by ls -l, including the file type", () => {
    expect(parseMode("rwxr-xr--")).toBe(0o754)
    expect(parseMode("drwxrwxrwt")).toBe(0o1777)
  })

  it("distinguishes s (special + execute) from S (special without execute)", () => {
    expect(parseMode("rwsr-xr-x")).toBe(0o4755)
    expect(parseMode("rwSr--r--")).toBe(0o4644)
    expect(parseMode("rwxr-sr-x")).toBe(0o2755)
  })

  it("rejects anything that is not a mode", () => {
    expect(() => parseMode("789")).toThrow()
    expect(() => parseMode("rwxrwx")).toThrow()
  })
})

describe("formatting", () => {
  it("round-trips through symbolic notation", () => {
    for (const mode of [0o644, 0o755, 0o4755, 0o2750, 0o1777, 0o4644]) expect(parseMode(toSymbolic(mode))).toBe(mode)
  })

  it("only shows a fourth octal digit when special bits are set", () => {
    expect(toOctal(0o644)).toBe("644")
    expect(toOctal(0o7)).toBe("007")
    expect(toOctal(0o1777)).toBe("1777")
  })

  it("maps classes and actions to the right bits", () => {
    expect(bitOf("owner", "read")).toBe(0o400)
    expect(bitOf("others", "execute")).toBe(0o001)
    expect(specialBit("sticky")).toBe(0o1000)
  })
})

import { describe, expect, it } from "vitest"
import { CHARSETS, entropyBits, generatePassword, type PasswordOptions, randomInt, strength } from "./logic"

const all = { lower: true, upper: true, digits: true, symbols: true }

const options = (extra: Partial<PasswordOptions> = {}): PasswordOptions => ({
  length: 24,
  sets: all,
  excludeAmbiguous: false,
  ...extra,
})

describe("generatePassword", () => {
  it("has the requested length", () => {
    expect(generatePassword(options({ length: 40 }))).toHaveLength(40)
  })

  it("contains every selected character set", () => {
    for (let i = 0; i < 50; i++) {
      const password = generatePassword(options({ length: 4 }))
      for (const { chars } of Object.values(CHARSETS)) {
        expect([...password].some((c) => chars.includes(c))).toBe(true)
      }
    }
  })

  it("only uses selected sets", () => {
    const password = generatePassword(options({ sets: { lower: false, upper: false, digits: true, symbols: false } }))
    expect(password).toMatch(/^\d+$/)
  })

  it("can exclude look-alike characters", () => {
    const password = generatePassword(options({ length: 128, excludeAmbiguous: true }))
    expect(password).not.toMatch(/[O0oIl1|]/)
  })

  it("requires at least one set", () => {
    const none = { lower: false, upper: false, digits: false, symbols: false }
    expect(() => generatePassword(options({ sets: none }))).toThrow("minimal satu")
  })
})

describe("randomInt", () => {
  it("stays inside the range and covers it", () => {
    const seen = new Set(Array.from({ length: 500 }, () => randomInt(6)))
    expect([...seen].sort()).toEqual([0, 1, 2, 3, 4, 5])
  })
})

describe("entropy", () => {
  it("grows with length and pool size", () => {
    expect(entropyBits(options({ length: 10, sets: { ...all, symbols: false, upper: false } }))).toBeCloseTo(51.7, 1)
    expect(strength(entropyBits(options({ length: 24 }))).label).toBe("Sangat kuat")
  })
})

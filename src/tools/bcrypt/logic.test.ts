import { compare, hash } from "bcryptjs"
import { describe, expect, it } from "vitest"
import { parseBcryptHash, passwordBytes } from "./logic"

describe("parseBcryptHash", () => {
  it("reads version, cost and salt", async () => {
    const info = parseBcryptHash(await hash("gula", 4))
    expect(info.version).toBe("2b")
    expect(info.cost).toBe(4)
    expect(info.salt).toHaveLength(22)
  })

  it("accepts $2y$ hashes from PHP", () => {
    expect(parseBcryptHash("$2y$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234").version).toBe("2y")
  })

  it("rejects other strings", () => {
    expect(() => parseBcryptHash("$argon2id$v=19$...")).toThrow("bcrypt")
  })
})

describe("bcryptjs round trip", () => {
  it("verifies the right password only", async () => {
    const hashed = await hash("manis", 4)
    expect(await compare("manis", hashed)).toBe(true)
    expect(await compare("pahit", hashed)).toBe(false)
  })
})

describe("passwordBytes", () => {
  it("counts utf-8 bytes, not characters", () => {
    expect(passwordBytes("🍬")).toBe(4)
  })
})

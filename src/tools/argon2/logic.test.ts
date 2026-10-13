import { scrypt } from "hash-wasm"
import { describe, expect, it } from "vitest"
import { hashArgon2, hashScrypt, parseArgon2, verifyArgon2 } from "./logic"

const light = { iterations: 1, memoryMiB: 1, parallelism: 1 }

describe("argon2", () => {
  it("produces an encoded hash that verifies", async () => {
    const hash = await hashArgon2("argon2id", "manis", light)
    expect(hash.startsWith("$argon2id$v=19$m=1024,t=1,p=1$")).toBe(true)
    expect(await verifyArgon2("manis", hash)).toBe(true)
    expect(await verifyArgon2("pahit", hash)).toBe(false)
  })

  it("supports argon2i and argon2d", async () => {
    expect(await hashArgon2("argon2i", "x", light)).toMatch(/^\$argon2i\$/)
    expect(await hashArgon2("argon2d", "x", light)).toMatch(/^\$argon2d\$/)
  })

  it("reads parameters back from a hash", async () => {
    const info = parseArgon2(await hashArgon2("argon2id", "x", { iterations: 2, memoryMiB: 2, parallelism: 1 }))
    expect(info).toEqual({ variant: "argon2id", iterations: 2, memoryMiB: 2, parallelism: 1 })
  })

  it("rejects strings that are not argon2", () => {
    expect(() => parseArgon2("$2b$10$abc")).toThrow("Argon2")
  })
})

describe("scrypt", () => {
  it("matches RFC 7914 test vector", async () => {
    const hex = await scrypt({
      password: "password",
      salt: "NaCl",
      costFactor: 1024,
      blockSize: 8,
      parallelism: 16,
      hashLength: 64,
      outputType: "hex",
    })
    expect(hex).toBe(
      "fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640",
    )
  })

  it("returns hash and salt as hex", async () => {
    const { hash, salt } = await hashScrypt("x", { costLog2: 10, blockSize: 8, parallelism: 1 })
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(salt).toMatch(/^[0-9a-f]{32}$/)
  })
})

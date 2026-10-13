import { describe, expect, it } from "vitest"
import { signToken, verifySignature } from "../jwt/logic"
import { generateKeys } from "./logic"

describe("generateKeys", () => {
  it.each(["rsa-2048", "p256", "p521", "ed25519"] as const)("creates a %s pair usable for JWT", async (type) => {
    const keys = await generateKeys(type)
    expect(keys.publicPem).toMatch(/^-----BEGIN PUBLIC KEY-----/)
    expect(keys.privatePem).toMatch(/^-----BEGIN PRIVATE KEY-----/)
    expect(JSON.parse(keys.privateJwk)).toHaveProperty("d")
    expect(JSON.parse(keys.publicJwk)).not.toHaveProperty("d")

    const token = await signToken({
      alg: keys.alg,
      payload: "{}",
      key: keys.privatePem,
      expiresIn: "",
      issuedAt: false,
    })
    expect(await verifySignature(token, keys.publicPem)).toBe(true)
  })
})

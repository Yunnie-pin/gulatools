import { exportPKCS8, exportSPKI, generateKeyPair, SignJWT } from "jose"
import { describe, expect, it } from "vitest"
import { claimDate, decodeToken, signToken, tokenStatus, verifySignature } from "./logic"

const secret = "gula-rahasia"

const sign = (
  claims: Record<string, unknown>,
  alg = "HS256",
  key: CryptoKey | Uint8Array = new TextEncoder().encode(secret),
) => new SignJWT(claims).setProtectedHeader({ alg }).sign(key)

describe("decodeToken", () => {
  it("returns header and payload", async () => {
    const { header, payload } = decodeToken(await sign({ sub: "42" }))
    expect(header.alg).toBe("HS256")
    expect(payload.sub).toBe("42")
  })

  it("rejects garbage", () => {
    expect(() => decodeToken("not.a.jwt")).toThrow("Bukan JWT")
  })
})

describe("tokenStatus", () => {
  const now = new Date("2026-01-01T00:00:00Z")
  const at = (iso: string) => new Date(iso).getTime() / 1000

  it("detects expired tokens", () => {
    expect(tokenStatus({ exp: at("2025-12-31T00:00:00Z") }, now)).toBe("expired")
  })

  it("detects tokens not valid yet", () => {
    expect(tokenStatus({ nbf: at("2026-02-01T00:00:00Z") }, now)).toBe("not-yet-valid")
  })

  it("accepts tokens inside their window", () => {
    expect(tokenStatus({ exp: at("2026-06-01T00:00:00Z") }, now)).toBe("valid")
  })

  it("converts numeric claims to dates", () => {
    expect(claimDate({ iat: 0 }, "iat")?.toISOString()).toBe("1970-01-01T00:00:00.000Z")
  })
})

describe("verifySignature", () => {
  it("accepts the right HMAC secret", async () => {
    expect(await verifySignature(await sign({}), secret)).toBe(true)
  })

  it("rejects the wrong HMAC secret", async () => {
    expect(await verifySignature(await sign({}), "salah")).toBe(false)
  })

  it("verifies RS256 with a PEM public key", async () => {
    const { publicKey, privateKey } = await generateKeyPair("RS256")
    const token = await sign({}, "RS256", privateKey)
    expect(await verifySignature(token, await exportSPKI(publicKey))).toBe(true)
  })

  it("refuses unsigned tokens", async () => {
    const unsigned = `${btoa('{"alg":"none"}')}.${btoa("{}")}.`
    await expect(verifySignature(unsigned, secret)).rejects.toThrow("alg: none")
  })
})

describe("signToken", () => {
  const base = { alg: "HS256", payload: '{"sub":"42"}', key: secret, expiresIn: "", issuedAt: false } as const

  it("signs a token that verifies with the same secret", async () => {
    const token = await signToken(base)
    expect(decodeToken(token).payload).toEqual({ sub: "42" })
    expect(await verifySignature(token, secret)).toBe(true)
  })

  it("adds iat and exp when asked", async () => {
    const { payload } = decodeToken(await signToken({ ...base, issuedAt: true, expiresIn: "2h" }))
    expect((payload.exp ?? 0) - (payload.iat ?? 0)).toBe(7200)
  })

  it("signs ES256 with a PKCS#8 private key", async () => {
    const { publicKey, privateKey } = await generateKeyPair("ES256", { extractable: true })
    const token = await signToken({ ...base, alg: "ES256", key: await exportPKCS8(privateKey) })
    expect(await verifySignature(token, await exportSPKI(publicKey))).toBe(true)
  })

  it("rejects payloads that are not objects", async () => {
    await expect(signToken({ ...base, payload: "[1,2]" })).rejects.toThrow("objek")
    await expect(signToken({ ...base, payload: "{oops" })).rejects.toThrow("JSON")
  })
})

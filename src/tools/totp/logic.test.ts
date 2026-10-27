import { describe, expect, it } from "vitest"
import { bytesToBase32 } from "@/lib/bytes"
import { buildOtpauth, parseOtpauth, secretKey, type TotpConfig, totp } from "./logic"

const ascii = (text: string) => bytesToBase32(new TextEncoder().encode(text))

const config = (secret: string, algorithm: TotpConfig["algorithm"]): TotpConfig => ({
  secret,
  issuer: "",
  account: "",
  algorithm,
  digits: 8,
  period: 30,
})

describe("totp", () => {
  // RFC 6238 Appendix B: codes must match authenticator apps exactly
  it.each([
    [59, "SHA-1", "12345678901234567890", "94287082"],
    [1111111109, "SHA-1", "12345678901234567890", "07081804"],
    [1234567890, "SHA-256", "12345678901234567890123456789012", "91819424"],
    [20000000000, "SHA-512", "1234567890123456789012345678901234567890123456789012345678901234", "47863826"],
  ] as const)("matches the RFC 6238 vector at %i with %s", async (seconds, algorithm, key, expected) => {
    const { current } = await totp(config(ascii(key), algorithm), seconds * 1000)
    expect(current).toBe(expected)
  })

  it("reports the next code and seconds left in the period", async () => {
    const at = await totp(config(ascii("12345678901234567890"), "SHA-1"), 29_000)
    const later = await totp(config(ascii("12345678901234567890"), "SHA-1"), 31_000)
    expect(at.remaining).toBe(1)
    expect(at.next).toBe(later.current)
  })
})

describe("secretKey", () => {
  it("accepts secrets the way authenticator apps display them", () => {
    expect(new TextDecoder().decode(secretKey("gezd gnbv gy3t qojq===="))).toBe("1234567890")
  })

  it("asks for a secret instead of generating codes from an empty key", () => {
    expect(() => secretKey(" == ")).toThrow("secret")
  })
})

describe("otpauth", () => {
  it("parses the label, issuer and parameters", () => {
    expect(
      parseOtpauth(
        "otpauth://totp/Gula:arifin%40gula.id?secret=JBSWY3DPEHPK3PXP&issuer=Gula&algorithm=SHA256&digits=8",
      ),
    ).toEqual({
      secret: "JBSWY3DPEHPK3PXP",
      issuer: "Gula",
      account: "arifin@gula.id",
      algorithm: "SHA-256",
      digits: 8,
      period: 30,
    })
  })

  it("round-trips through buildOtpauth", () => {
    const original: TotpConfig = {
      secret: "JBSWY3DPEHPK3PXP",
      issuer: "Gula Tools",
      account: "me@x.id",
      algorithm: "SHA-1",
      digits: 6,
      period: 60,
    }
    expect(parseOtpauth(buildOtpauth(original))).toEqual(original)
  })

  it("rejects HOTP and malformed URIs", () => {
    expect(() => parseOtpauth("otpauth://hotp/x?secret=AAAA")).toThrow("otpauth")
    expect(() => parseOtpauth("not a uri")).toThrow("otpauth")
  })
})

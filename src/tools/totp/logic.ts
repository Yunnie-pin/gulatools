import { LocalizedError } from "@/i18n/errors"

export const TOTP_ALGORITHMS = [
  { value: "SHA-1", label: "SHA-1" },
  { value: "SHA-256", label: "SHA-256" },
  { value: "SHA-512", label: "SHA-512" },
] as const

export type TotpAlgorithm = (typeof TOTP_ALGORITHMS)[number]["value"]

export type TotpConfig = {
  secret: string
  issuer: string
  account: string
  algorithm: TotpAlgorithm
  digits: number
  period: number
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

export function base32Decode(input: string): Uint8Array<ArrayBuffer> {
  const clean = input.replace(/[\s-]/g, "").replace(/=+$/, "").toUpperCase()
  if (!clean) throw new LocalizedError("emptyTotpSecret")
  const bytes: number[] = []
  let buffer = 0
  let bits = 0
  for (const char of clean) {
    const value = BASE32.indexOf(char)
    if (value < 0) throw new LocalizedError("invalidBase32")
    buffer = (buffer << 5) | value
    bits += 5
    if (bits >= 8) {
      bits -= 8
      bytes.push((buffer >> bits) & 0xff)
    }
  }
  return new Uint8Array(bytes)
}

export function base32Encode(bytes: Uint8Array): string {
  let output = ""
  let buffer = 0
  let bits = 0
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte
    bits += 8
    while (bits >= 5) {
      bits -= 5
      output += BASE32[(buffer >> bits) & 31]
    }
  }
  if (bits > 0) output += BASE32[(buffer << (5 - bits)) & 31]
  return output
}

export const randomSecret = () => base32Encode(crypto.getRandomValues(new Uint8Array(20)))

export async function hotp(key: Uint8Array<ArrayBuffer>, counter: number, algorithm: TotpAlgorithm, digits: number) {
  const message = new DataView(new ArrayBuffer(8))
  message.setBigUint64(0, BigInt(counter))
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: algorithm }, false, ["sign"])
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, message))
  const offset = mac[mac.length - 1]! & 0x0f
  const binary = new DataView(mac.buffer).getUint32(offset) & 0x7fffffff
  return String(binary % 10 ** digits).padStart(digits, "0")
}

export type TotpCodes = { current: string; next: string; remaining: number }

export async function totp(config: TotpConfig, now: number): Promise<TotpCodes> {
  const key = base32Decode(config.secret)
  const step = Math.floor(now / 1000 / config.period)
  const [current, next] = await Promise.all([
    hotp(key, step, config.algorithm, config.digits),
    hotp(key, step + 1, config.algorithm, config.digits),
  ])
  return { current, next, remaining: config.period - (Math.floor(now / 1000) % config.period) }
}

const OTPAUTH_ALGORITHMS: Record<string, TotpAlgorithm> = { SHA1: "SHA-1", SHA256: "SHA-256", SHA512: "SHA-512" }

export function parseOtpauth(uri: string): TotpConfig {
  let url: URL
  try {
    url = new URL(uri.trim())
  } catch {
    throw new LocalizedError("invalidOtpauth")
  }
  const secret = url.searchParams.get("secret")
  if (url.protocol !== "otpauth:" || url.host.toLowerCase() !== "totp" || !secret) {
    throw new LocalizedError("invalidOtpauth")
  }
  const label = decodeURIComponent(url.pathname.replace(/^\//, ""))
  const colon = label.indexOf(":")
  const params = url.searchParams
  return {
    secret,
    issuer: params.get("issuer") ?? (colon >= 0 ? label.slice(0, colon) : ""),
    account: colon >= 0 ? label.slice(colon + 1).trim() : label,
    algorithm: OTPAUTH_ALGORITHMS[params.get("algorithm")?.toUpperCase() ?? ""] ?? "SHA-1",
    digits: Number(params.get("digits")) === 8 ? 8 : 6,
    period: Number(params.get("period")) || 30,
  }
}

export function buildOtpauth({ secret, issuer, account, algorithm, digits, period }: TotpConfig): string {
  const label = [issuer, account].filter(Boolean).map(encodeURIComponent).join(":")
  const params = new URLSearchParams({ secret: secret.replace(/[\s=-]/g, "").toUpperCase() })
  if (issuer) params.set("issuer", issuer)
  params.set("algorithm", algorithm.replace("-", ""))
  params.set("digits", String(digits))
  params.set("period", String(period))
  return `otpauth://totp/${label}?${params}`
}

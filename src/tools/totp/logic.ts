import { LocalizedError } from "@/i18n/errors"
import { base32ToBytes, bytesToBase32 } from "@/lib/bytes"

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

export function secretKey(secret: string): Uint8Array<ArrayBuffer> {
  if (!secret.replace(/[\s=-]/g, "")) throw new LocalizedError("emptyTotpSecret")
  return base32ToBytes(secret)
}

export const randomSecret = () => bytesToBase32(crypto.getRandomValues(new Uint8Array(20)))

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
  const key = secretKey(config.secret)
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

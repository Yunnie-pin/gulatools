import {
  compactVerify,
  decodeJwt,
  decodeProtectedHeader,
  errors,
  importJWK,
  importPKCS8,
  importSPKI,
  importX509,
  type JWTPayload,
  type ProtectedHeaderParameters,
  SignJWT,
} from "jose"
import { LocalizedError } from "@/i18n/errors"
import { isRecord } from "@/lib/guards"

export type DecodedJwt = {
  header: ProtectedHeaderParameters
  payload: JWTPayload
}

export type TokenStatus = "valid" | "expired" | "not-yet-valid"

export const TIME_CLAIMS = ["exp", "nbf", "iat"] as const

export type TimeClaim = (typeof TIME_CLAIMS)[number]

export const isHmac = (alg: string) => alg.startsWith("HS")

export function decodeToken(token: string): DecodedJwt {
  try {
    return { header: decodeProtectedHeader(token), payload: decodeJwt(token) }
  } catch {
    throw new LocalizedError("invalidJwt")
  }
}

export function claimDate(payload: JWTPayload, claim: TimeClaim): Date | undefined {
  const value = payload[claim]
  return typeof value === "number" ? new Date(value * 1000) : undefined
}

export function tokenStatus(payload: JWTPayload, now = new Date()): TokenStatus {
  const exp = claimDate(payload, "exp")
  const nbf = claimDate(payload, "nbf")
  if (exp && exp <= now) return "expired"
  if (nbf && nbf > now) return "not-yet-valid"
  return "valid"
}

async function importKey(key: string, alg: string) {
  if (isHmac(alg)) return new TextEncoder().encode(key)
  const trimmed = key.trim()
  if (trimmed.startsWith("{")) return importJWK(JSON.parse(trimmed), alg)
  if (trimmed.includes("BEGIN CERTIFICATE")) return importX509(trimmed, alg)
  if (trimmed.includes("BEGIN PUBLIC KEY")) return importSPKI(trimmed, alg)
  throw new LocalizedError("publicKeyFormat")
}

export async function verifySignature(token: string, key: string): Promise<boolean> {
  const { alg } = decodeProtectedHeader(token)
  if (!alg || alg === "none") throw new LocalizedError("unsignedJwt")
  try {
    await compactVerify(token, await importKey(key, alg))
    return true
  } catch (error) {
    if (error instanceof errors.JWSSignatureVerificationFailed) return false
    throw error
  }
}

export const SIGN_ALGORITHMS = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "ES256",
  "ES384",
  "ES512",
  "EdDSA",
] as const

export type SignAlgorithm = (typeof SIGN_ALGORITHMS)[number]

export type SignOptions = {
  alg: SignAlgorithm
  payload: string
  key: string
  expiresIn: string
  issuedAt: boolean
}

async function importSigningKey(key: string, alg: SignAlgorithm) {
  if (isHmac(alg)) return new TextEncoder().encode(key)
  const trimmed = key.trim()
  if (trimmed.startsWith("{")) return importJWK(JSON.parse(trimmed), alg)
  if (trimmed.includes("BEGIN PRIVATE KEY")) return importPKCS8(trimmed, alg)
  throw new LocalizedError("privateKeyFormat")
}

function parsePayload(payload: string): JWTPayload {
  let claims: unknown
  try {
    claims = JSON.parse(payload)
  } catch {
    throw new LocalizedError("payloadNotJson")
  }
  if (!isRecord(claims)) throw new LocalizedError("payloadNotObject")
  return claims
}

export async function signToken({ alg, payload, key, expiresIn, issuedAt }: SignOptions): Promise<string> {
  const claims = parsePayload(payload)
  if (!key) throw new LocalizedError(isHmac(alg) ? "emptySecret" : "emptyPrivateKey")
  const jwt = new SignJWT(claims).setProtectedHeader({ alg, typ: "JWT" })
  if (issuedAt) jwt.setIssuedAt()
  if (expiresIn.trim()) jwt.setExpirationTime(expiresIn.trim())
  return jwt.sign(await importSigningKey(key, alg))
}

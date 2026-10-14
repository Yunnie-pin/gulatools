import { LocalizedError } from "@/i18n/errors"
import { bytesToBase64, bytesToHex } from "@/lib/bytes"

export const HMAC_ALGORITHMS = [
  { value: "SHA-1", label: "SHA-1" },
  { value: "SHA-256", label: "SHA-256" },
  { value: "SHA-384", label: "SHA-384" },
  { value: "SHA-512", label: "SHA-512" },
] as const

export type HmacAlgorithm = (typeof HMAC_ALGORITHMS)[number]["value"]

export type HmacDigest = { hex: string; base64: string }

export async function hmac(message: string, key: string, algorithm: HmacAlgorithm): Promise<HmacDigest> {
  if (!key) throw new LocalizedError("emptyKey")
  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"],
  )
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message)))
  return { hex: bytesToHex(signature), base64: bytesToBase64(signature) }
}

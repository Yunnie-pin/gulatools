import { LocalizedError } from "@/i18n/errors"
import { base64ToBytes, bytesToBase64 } from "@/lib/bytes"

export const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16
const IV_BYTES = 12
const TAG_BYTES = 16

const encoder = new TextEncoder()

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>) {
  const base = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"])
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

function requirePassword(password: string) {
  if (!password) throw new LocalizedError("emptyPassword")
}

export async function encryptText(plaintext: string, password: string): Promise<string> {
  requirePassword(password)
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const key = await deriveKey(password, salt)
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plaintext)),
  )
  const payload = new Uint8Array(SALT_BYTES + IV_BYTES + ciphertext.length)
  payload.set(salt)
  payload.set(iv, SALT_BYTES)
  payload.set(ciphertext, SALT_BYTES + IV_BYTES)
  return bytesToBase64(payload)
}

export async function decryptText(payload: string, password: string): Promise<string> {
  requirePassword(password)
  const bytes = base64ToBytes(payload)
  if (bytes.length < SALT_BYTES + IV_BYTES + TAG_BYTES) throw new LocalizedError("ciphertextTooShort")
  const salt = bytes.slice(0, SALT_BYTES)
  const iv = bytes.slice(SALT_BYTES, SALT_BYTES + IV_BYTES)
  const key = await deriveKey(password, salt)
  try {
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, bytes.slice(SALT_BYTES + IV_BYTES))
    return new TextDecoder().decode(plaintext)
  } catch {
    throw new LocalizedError("wrongPasswordOrTampered")
  }
}

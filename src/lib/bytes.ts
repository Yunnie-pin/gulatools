import { LocalizedError } from "@/i18n/errors"

const CHUNK = 0x8000

export function bytesToBase64(bytes: Uint8Array, urlSafe = false): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i += CHUNK) binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  const base64 = btoa(binary)
  return urlSafe ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : base64
}

export function base64ToBytes(input: string): Uint8Array {
  const normalized = input.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  try {
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
  } catch {
    throw new LocalizedError("invalidBase64")
  }
}

export const bytesToHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")

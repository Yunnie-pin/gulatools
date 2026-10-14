import { LocalizedError } from "@/i18n/errors"
import { base64ToBytes, bytesToBase64 } from "@/lib/bytes"

export function encodeBase64(text: string, urlSafe = false): string {
  return bytesToBase64(new TextEncoder().encode(text), urlSafe)
}

export function decodeBase64(input: string): string {
  const bytes = base64ToBytes(input)
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    throw new LocalizedError("notUtf8")
  }
}

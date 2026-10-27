import { LocalizedError } from "@/i18n/errors"
import {
  base32ToBytes,
  base58ToBytes,
  base64ToBytes,
  bytesToBase32,
  bytesToBase58,
  bytesToBase64,
  bytesToHex,
  hexToBytes,
} from "@/lib/bytes"

export type Encoding = "base64" | "base32" | "base58" | "hex"

export function encodeText(text: string, encoding: Encoding, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text)
  if (encoding === "base32") return bytesToBase32(bytes, true)
  if (encoding === "base58") return bytesToBase58(bytes)
  if (encoding === "hex") return bytesToHex(bytes)
  return bytesToBase64(bytes, urlSafe)
}

const DECODERS: Record<Encoding, (input: string) => Uint8Array> = {
  base64: base64ToBytes,
  base32: base32ToBytes,
  base58: base58ToBytes,
  hex: hexToBytes,
}

export function decodeText(input: string, encoding: Encoding): string {
  const bytes = DECODERS[encoding](input)
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    throw new LocalizedError("notUtf8")
  }
}

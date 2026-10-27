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

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

export function bytesToBase32(bytes: Uint8Array, pad = false): string {
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
  return pad ? output.padEnd(Math.ceil(output.length / 8) * 8, "=") : output
}

export function base32ToBytes(input: string): Uint8Array<ArrayBuffer> {
  const clean = input.replace(/[\s-]/g, "").replace(/=+$/, "").toUpperCase()
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

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

export function bytesToBase58(bytes: Uint8Array): string {
  const zeros = bytes.findIndex((byte) => byte !== 0)
  const leading = zeros < 0 ? bytes.length : zeros
  let value = BigInt(`0x${bytesToHex(bytes) || "0"}`)
  let output = ""
  while (value > 0n) {
    output = BASE58[Number(value % 58n)] + output
    value /= 58n
  }
  return "1".repeat(leading) + output
}

export function base58ToBytes(input: string): Uint8Array {
  const clean = input.replace(/\s/g, "")
  let value = 0n
  for (const char of clean) {
    const digit = BASE58.indexOf(char)
    if (digit < 0) throw new LocalizedError("invalidBase58")
    value = value * 58n + BigInt(digit)
  }
  const hex = value ? value.toString(16) : ""
  const body = hexToBytes(hex.length % 2 ? `0${hex}` : hex)
  const leading = clean.length - clean.replace(/^1+/, "").length
  return Uint8Array.from([...new Uint8Array(leading), ...body])
}

export function hexToBytes(input: string): Uint8Array {
  const clean = input.replace(/0x/gi, "").replace(/[\s:,-]/g, "")
  if (clean.length % 2 || /[^0-9a-f]/i.test(clean)) throw new LocalizedError("invalidHex")
  return Uint8Array.from(clean.match(/../g) ?? [], (pair) => Number.parseInt(pair, 16))
}

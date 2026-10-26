import { LocalizedError } from "@/i18n/errors"
import { base64ToBytes, bytesToBase64 } from "@/lib/bytes"

export type CompressionFormat = "gzip" | "deflate" | "deflate-raw"

async function pipe(bytes: Uint8Array<ArrayBuffer>, stream: CompressionStream | DecompressionStream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer())
}

export async function compress(text: string, format: CompressionFormat): Promise<string> {
  return bytesToBase64(await pipe(new TextEncoder().encode(text), new CompressionStream(format)))
}

export function detectFormat(bytes: Uint8Array): CompressionFormat {
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) return "gzip"
  if ((bytes[0]! & 0x0f) === 8 && ((bytes[0]! << 8) | bytes[1]!) % 31 === 0) return "deflate"
  return "deflate-raw"
}

export async function decompress(base64: string): Promise<{ text: string; format: CompressionFormat }> {
  const bytes = base64ToBytes(base64) as Uint8Array<ArrayBuffer>
  const format = detectFormat(bytes)
  let output: Uint8Array
  try {
    output = await pipe(bytes, new DecompressionStream(format))
  } catch {
    throw new LocalizedError("invalidCompressed", format)
  }
  try {
    return { text: new TextDecoder("utf-8", { fatal: true }).decode(output), format }
  } catch {
    throw new LocalizedError("notUtf8")
  }
}

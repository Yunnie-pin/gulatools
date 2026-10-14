import { LocalizedError } from "@/i18n/errors"
import { base64ToBytes, bytesToBase64 } from "./bytes"

const PREFIX = "#s="

export const MAX_SHARE_URL_LENGTH = 16_000

async function pipe(bytes: Uint8Array<ArrayBuffer>, stream: CompressionStream | DecompressionStream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer())
}

export async function encodeShare(text: string): Promise<string> {
  const compressed = await pipe(new TextEncoder().encode(text), new CompressionStream("deflate-raw"))
  return bytesToBase64(compressed, true)
}

export async function decodeShare(encoded: string): Promise<string> {
  try {
    const bytes = new Uint8Array(base64ToBytes(encoded))
    return new TextDecoder().decode(await pipe(bytes, new DecompressionStream("deflate-raw")))
  } catch {
    throw new LocalizedError("brokenShareLink")
  }
}

export const sharedFromHash = (hash: string) => (hash.startsWith(PREFIX) ? hash.slice(PREFIX.length) : null)

export async function buildShareUrl(text: string, location: Pick<Location, "origin" | "pathname">) {
  const url = `${location.origin}${location.pathname}${PREFIX}${await encodeShare(text)}`
  if (url.length > MAX_SHARE_URL_LENGTH) throw new LocalizedError("shareTooLarge")
  return url
}

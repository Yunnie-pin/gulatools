import { LocalizedError } from "@/i18n/errors"
import { base64ToBytes, bytesToBase64 } from "./bytes"
import { isRecord } from "./guards"

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

const STATE_PREFIX = "#t="

export const sharedStateFromHash = (hash: string) =>
  hash.startsWith(STATE_PREFIX) ? hash.slice(STATE_PREFIX.length) : null

export async function buildStateShareUrl(
  state: Record<string, unknown>,
  location: Pick<Location, "origin" | "pathname">,
) {
  const url = `${location.origin}${location.pathname}${STATE_PREFIX}${await encodeShare(JSON.stringify(state))}`
  if (url.length > MAX_SHARE_URL_LENGTH) throw new LocalizedError("shareTooLarge")
  return url
}

export async function decodeSharedState(encoded: string): Promise<Record<string, unknown>> {
  const parsed: unknown = JSON.parse(await decodeShare(encoded))
  if (!isRecord(parsed)) throw new LocalizedError("brokenShareLink")
  return parsed
}

/** `?mode=decode&count=5` → { mode: "decode", count: 5 }; nilai yang bukan JSON dibaca sebagai string. */
export function stateFromQuery(search: string): Record<string, unknown> {
  const state: Record<string, unknown> = {}
  for (const [key, raw] of new URLSearchParams(search)) {
    try {
      state[key] = JSON.parse(raw)
    } catch {
      state[key] = raw
    }
  }
  return state
}

import { createMD5, createSHA1, createSHA256, createSHA384, createSHA512 } from "hash-wasm"

export const ALGORITHMS = [
  { id: "md5", label: "MD5", create: createMD5 },
  { id: "sha1", label: "SHA-1", create: createSHA1 },
  { id: "sha256", label: "SHA-256", create: createSHA256 },
  { id: "sha384", label: "SHA-384", create: createSHA384 },
  { id: "sha512", label: "SHA-512", create: createSHA512 },
] as const

export type AlgorithmId = (typeof ALGORITHMS)[number]["id"]

export type Digests = Record<AlgorithmId, string>

export async function hashChunks(chunks: AsyncIterable<Uint8Array> | Iterable<Uint8Array>): Promise<Digests> {
  const hashers = await Promise.all(ALGORITHMS.map((algorithm) => algorithm.create()))
  for (const hasher of hashers) hasher.init()
  for await (const chunk of chunks) {
    for (const hasher of hashers) hasher.update(chunk)
  }
  return Object.fromEntries(ALGORITHMS.map(({ id }, i) => [id, hashers[i]!.digest("hex")])) as Digests
}

async function* readFile(file: Blob): AsyncGenerator<Uint8Array> {
  const reader = file.stream().getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) return
    yield value
  }
}

export const hashText = (text: string) => hashChunks([new TextEncoder().encode(text)])

export const hashFile = (file: Blob) => hashChunks(readFile(file))

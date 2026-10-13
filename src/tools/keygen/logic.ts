import { exportJWK, exportPKCS8, exportSPKI, generateKeyPair } from "jose"

export const KEY_TYPES = [
  { value: "rsa-2048", label: "RSA 2048", alg: "RS256", options: { modulusLength: 2048 } },
  { value: "rsa-3072", label: "RSA 3072", alg: "RS256", options: { modulusLength: 3072 } },
  { value: "rsa-4096", label: "RSA 4096", alg: "RS256", options: { modulusLength: 4096 } },
  { value: "p256", label: "EC P-256", alg: "ES256", options: {} },
  { value: "p384", label: "EC P-384", alg: "ES384", options: {} },
  { value: "p521", label: "EC P-521", alg: "ES512", options: {} },
  { value: "ed25519", label: "Ed25519", alg: "EdDSA", options: { crv: "Ed25519" } },
] as const

export type KeyType = (typeof KEY_TYPES)[number]["value"]

export type KeyAlgorithm = (typeof KEY_TYPES)[number]["alg"]

export type KeyPairExport = {
  alg: KeyAlgorithm
  publicPem: string
  privatePem: string
  publicJwk: string
  privateJwk: string
}

const pretty = (value: unknown) => JSON.stringify(value, null, 2)

export async function generateKeys(type: KeyType): Promise<KeyPairExport> {
  const spec = KEY_TYPES.find((k) => k.value === type) ?? KEY_TYPES[0]
  const { publicKey, privateKey } = await generateKeyPair(spec.alg, { extractable: true, ...spec.options })
  const [publicPem, privatePem, publicJwk, privateJwk] = await Promise.all([
    exportSPKI(publicKey),
    exportPKCS8(privateKey),
    exportJWK(publicKey),
    exportJWK(privateKey),
  ])
  return {
    alg: spec.alg,
    publicPem,
    privatePem,
    publicJwk: pretty({ ...publicJwk, alg: spec.alg }),
    privateJwk: pretty({ ...privateJwk, alg: spec.alg }),
  }
}

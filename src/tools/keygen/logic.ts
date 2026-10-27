import {
  calculateJwkThumbprint,
  exportJWK,
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importJWK,
  importPKCS8,
  importSPKI,
  importX509,
  type JWK,
} from "jose"
import { LocalizedError } from "@/i18n/errors"

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

export type KeyConversion = {
  alg: KeyAlgorithm
  thumbprint: string
  outputs: { title: string; value: string }[]
}

const CANDIDATE_ALGS = ["RS256", "ES256", "ES384", "ES512", "EdDSA"] as const satisfies readonly KeyAlgorithm[]

const PRIVATE_FIELDS = ["d", "p", "q", "dp", "dq", "qi", "oth"]

const toPublicJwk = (jwk: JWK): JWK =>
  Object.fromEntries(Object.entries(jwk).filter(([field]) => !PRIVATE_FIELDS.includes(field)))

function algOfJwk(jwk: JWK): KeyAlgorithm {
  if (jwk.kty === "RSA") return "RS256"
  if (jwk.kty === "EC" && jwk.crv === "P-256") return "ES256"
  if (jwk.kty === "EC" && jwk.crv === "P-384") return "ES384"
  if (jwk.kty === "EC" && jwk.crv === "P-521") return "ES512"
  if (jwk.kty === "OKP" && jwk.crv === "Ed25519") return "EdDSA"
  throw new LocalizedError("unsupportedKey")
}

async function importPem(pem: string): Promise<{ key: CryptoKey; alg: KeyAlgorithm }> {
  if (/-----BEGIN (RSA|EC) (PUBLIC|PRIVATE) KEY-----/.test(pem)) throw new LocalizedError("legacyPem")
  const importer = pem.includes("-----BEGIN CERTIFICATE-----")
    ? importX509
    : pem.includes("-----BEGIN PRIVATE KEY-----")
      ? importPKCS8
      : pem.includes("-----BEGIN PUBLIC KEY-----")
        ? importSPKI
        : null
  if (!importer) throw new LocalizedError("unsupportedKey")
  for (const alg of CANDIDATE_ALGS) {
    try {
      return { key: await importer(pem, alg, { extractable: true }), alg }
    } catch {}
  }
  throw new LocalizedError("unsupportedKey")
}

export async function convertKey(input: string): Promise<KeyConversion> {
  const text = input.trim()
  let jwk: JWK
  let alg: KeyAlgorithm
  if (text.startsWith("{")) {
    try {
      jwk = JSON.parse(text) as JWK
    } catch {
      throw new LocalizedError("unsupportedKey")
    }
    alg = algOfJwk(jwk)
  } else {
    const imported = await importPem(text)
    alg = imported.alg
    jwk = await exportJWK(imported.key)
  }

  const isPrivate = "d" in jwk
  const publicJwk = { ...toPublicJwk(jwk), alg: jwk.alg ?? alg }
  const publicKey = await importJWK({ ...publicJwk, alg }, alg, { extractable: true })
  const outputs = [
    { title: "Public key (PEM)", value: await exportSPKI(publicKey as CryptoKey) },
    { title: "Public key (JWK)", value: pretty(publicJwk) },
  ]
  if (isPrivate) {
    const privateKey = await importJWK({ ...jwk, alg }, alg, { extractable: true })
    outputs.push(
      { title: "Private key (PEM, PKCS#8)", value: await exportPKCS8(privateKey as CryptoKey) },
      { title: "Private key (JWK)", value: pretty({ ...jwk, alg: jwk.alg ?? alg }) },
    )
  }
  return { alg, thumbprint: await calculateJwkThumbprint(publicJwk), outputs }
}

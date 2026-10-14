import { LocalizedError } from "@/i18n/errors"
import { base64ToBytes, bytesToBase64, bytesToHex } from "@/lib/bytes"
import {
  bitStringBytes,
  child,
  children,
  type DerNode,
  decodeOid,
  decodeString,
  decodeTime,
  readNode,
  TAG,
} from "./der"

export type PublicKeyInfo = { algorithm: string; size?: number; curve?: string; exponent?: number }

export type Extension = { oid: string; name: string; critical: boolean }

export type Certificate = {
  der: Uint8Array
  version: number
  serial: string
  subject: string
  issuer: string
  notBefore: Date
  notAfter: Date
  signatureAlgorithm: string
  publicKey: PublicKeyInfo
  subjectAltNames: string[]
  basicConstraints?: { ca: boolean; pathLength?: number }
  keyUsage: string[]
  extendedKeyUsage: string[]
  extensions: Extension[]
}

const NAMES: Record<string, string> = {
  "2.5.4.3": "CN",
  "2.5.4.5": "serialNumber",
  "2.5.4.6": "C",
  "2.5.4.7": "L",
  "2.5.4.8": "ST",
  "2.5.4.10": "O",
  "2.5.4.11": "OU",
  "1.2.840.113549.1.9.1": "emailAddress",
  "0.9.2342.19200300.100.1.25": "DC",
}

const ALGORITHMS: Record<string, string> = {
  "1.2.840.113549.1.1.1": "RSA",
  "1.2.840.113549.1.1.5": "sha1WithRSAEncryption",
  "1.2.840.113549.1.1.10": "RSASSA-PSS",
  "1.2.840.113549.1.1.11": "sha256WithRSAEncryption",
  "1.2.840.113549.1.1.12": "sha384WithRSAEncryption",
  "1.2.840.113549.1.1.13": "sha512WithRSAEncryption",
  "1.2.840.10045.2.1": "EC",
  "1.2.840.10045.4.3.2": "ecdsa-with-SHA256",
  "1.2.840.10045.4.3.3": "ecdsa-with-SHA384",
  "1.2.840.10045.4.3.4": "ecdsa-with-SHA512",
  "1.3.101.110": "X25519",
  "1.3.101.112": "Ed25519",
  "1.3.101.113": "Ed448",
}

const CURVES: Record<string, [name: string, bits: number]> = {
  "1.2.840.10045.3.1.7": ["P-256", 256],
  "1.3.132.0.34": ["P-384", 384],
  "1.3.132.0.35": ["P-521", 521],
}

const EXTENSIONS: Record<string, string> = {
  "2.5.29.14": "Subject Key Identifier",
  "2.5.29.15": "Key Usage",
  "2.5.29.17": "Subject Alternative Name",
  "2.5.29.19": "Basic Constraints",
  "2.5.29.31": "CRL Distribution Points",
  "2.5.29.32": "Certificate Policies",
  "2.5.29.35": "Authority Key Identifier",
  "2.5.29.37": "Extended Key Usage",
  "1.3.6.1.5.5.7.1.1": "Authority Information Access",
  "1.3.6.1.4.1.11129.2.4.2": "Certificate Transparency SCTs",
}

const KEY_USAGES = [
  "Digital Signature",
  "Non Repudiation",
  "Key Encipherment",
  "Data Encipherment",
  "Key Agreement",
  "Certificate Sign",
  "CRL Sign",
  "Encipher Only",
  "Decipher Only",
]

const EXTENDED_KEY_USAGES: Record<string, string> = {
  "1.3.6.1.5.5.7.3.1": "TLS Web Server Authentication",
  "1.3.6.1.5.5.7.3.2": "TLS Web Client Authentication",
  "1.3.6.1.5.5.7.3.3": "Code Signing",
  "1.3.6.1.5.5.7.3.4": "E-mail Protection",
  "1.3.6.1.5.5.7.3.8": "Time Stamping",
  "1.3.6.1.5.5.7.3.9": "OCSP Signing",
}

const PEM_BLOCK = /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/g

const oidName = (oid: string, table: Record<string, string>) => table[oid] ?? oid

const toInteger = (content: Uint8Array) => content.reduce((value, byte) => value * 256 + byte, 0)

const hexColon = (bytes: Uint8Array) => bytesToHex(bytes).toUpperCase().match(/../g)?.join(":") ?? ""

function formatName(name: DerNode): string {
  return children(name)
    .flatMap((set) => children(set))
    .map(
      (attribute) => `${oidName(decodeOid(child(attribute, 0).content), NAMES)}=${decodeString(child(attribute, 1))}`,
    )
    .reverse()
    .join(", ")
}

const algorithmOf = (algorithmIdentifier: DerNode) =>
  oidName(decodeOid(child(algorithmIdentifier, 0).content), ALGORITHMS)

function bitLength(integer: Uint8Array): number {
  const start = integer.findIndex((byte) => byte !== 0)
  if (start < 0) return 0
  return (integer.length - start) * 8 - Math.clz32(integer[start] ?? 0) + 24
}

function parsePublicKey(spki: DerNode): PublicKeyInfo {
  const [algorithmIdentifier, key] = children(spki)
  if (!algorithmIdentifier || !key) throw new LocalizedError("invalidCertificate")
  const algorithm = algorithmOf(algorithmIdentifier)
  if (algorithm === "RSA") {
    const [modulus, exponent] = children(readNode(bitStringBytes(key)))
    return {
      algorithm,
      size: bitLength(modulus?.content ?? new Uint8Array()),
      exponent: toInteger(exponent?.content ?? new Uint8Array()),
    }
  }
  if (algorithm === "EC") {
    const curveOid = decodeOid(child(algorithmIdentifier, 1).content)
    const [curve = curveOid, size] = CURVES[curveOid] ?? []
    return { algorithm, curve, size }
  }
  return { algorithm }
}

function formatIp(bytes: Uint8Array): string {
  if (bytes.length === 4) return bytes.join(".")
  const groups = Array.from({ length: bytes.length / 2 }, (_, i) =>
    (((bytes[2 * i] ?? 0) << 8) | (bytes[2 * i + 1] ?? 0)).toString(16),
  )
  return groups.join(":")
}

function parseGeneralName({ tag, content }: DerNode): string | null {
  const text = new TextDecoder().decode(content)
  if (tag === 0x81) return `email:${text}`
  if (tag === 0x82) return `DNS:${text}`
  if (tag === 0x86) return `URI:${text}`
  if (tag === 0x87) return `IP:${formatIp(content)}`
  return null
}

function decodeKeyUsage(value: DerNode): string[] {
  const bits = bitStringBytes(value)
  return KEY_USAGES.filter((_, i) => ((bits[i >> 3] ?? 0) & (0x80 >> (i & 7))) !== 0)
}

function parseCertificate(der: Uint8Array): Certificate {
  const certificate = readNode(der)
  if (certificate.tag !== TAG.sequence) throw new LocalizedError("invalidCertificate")
  const [tbs, signatureAlgorithm] = children(certificate)
  if (!tbs || !signatureAlgorithm) throw new LocalizedError("invalidCertificate")

  const fields = children(tbs)
  const versionField = fields[0]?.tag === 0xa0 ? fields[0] : undefined
  const [serial, , issuer, validity, subject, spki] = versionField ? fields.slice(1) : fields
  if (!serial || !issuer || !validity || !subject || !spki) throw new LocalizedError("invalidCertificate")

  const result: Certificate = {
    der,
    version: versionField ? toInteger(child(versionField, 0).content) + 1 : 1,
    serial: hexColon(
      serial.content[0] === 0 && serial.content.length > 1 ? serial.content.subarray(1) : serial.content,
    ),
    subject: formatName(subject),
    issuer: formatName(issuer),
    notBefore: decodeTime(child(validity, 0)),
    notAfter: decodeTime(child(validity, 1)),
    signatureAlgorithm: algorithmOf(signatureAlgorithm),
    publicKey: parsePublicKey(spki),
    subjectAltNames: [],
    keyUsage: [],
    extendedKeyUsage: [],
    extensions: [],
  }

  const extensionList = fields.find((field) => field.tag === 0xa3)
  for (const extension of extensionList ? children(child(extensionList, 0)) : []) {
    const parts = children(extension)
    const oid = decodeOid(child(extension, 0).content)
    const critical = parts[1]?.tag === TAG.boolean && parts[1].content[0] !== 0
    const value = readNode(child(extension, parts.length - 1).content)
    result.extensions.push({ oid, name: oidName(oid, EXTENSIONS), critical })

    if (oid === "2.5.29.17") result.subjectAltNames = children(value).flatMap((name) => parseGeneralName(name) ?? [])
    if (oid === "2.5.29.15") result.keyUsage = decodeKeyUsage(value)
    if (oid === "2.5.29.37") {
      result.extendedKeyUsage = children(value).map((usage) => oidName(decodeOid(usage.content), EXTENDED_KEY_USAGES))
    }
    if (oid === "2.5.29.19") {
      const items = children(value)
      const ca = items[0]?.tag === TAG.boolean && items[0].content[0] !== 0
      const pathLength = items.find((item) => item.tag === TAG.integer)
      result.basicConstraints = { ca, ...(pathLength && { pathLength: toInteger(pathLength.content) }) }
    }
  }

  return result
}

export function parseCertificates(input: string): Certificate[] {
  const text = input.trim()
  if (text.includes("PRIVATE KEY-----")) throw new LocalizedError("privateKeyNotCertificate")
  const blocks = [...text.matchAll(PEM_BLOCK)].map((match) => match[1] ?? "")
  const sources = blocks.length ? blocks : [text]
  try {
    return sources.map((source) => parseCertificate(base64ToBytes(source)))
  } catch {
    throw new LocalizedError("invalidCertificate")
  }
}

export const derToPem = (der: Uint8Array) =>
  `-----BEGIN CERTIFICATE-----\n${
    bytesToBase64(der)
      .match(/.{1,64}/g)
      ?.join("\n") ?? ""
  }\n-----END CERTIFICATE-----\n`

export async function fingerprint(der: Uint8Array, algorithm: "SHA-1" | "SHA-256"): Promise<string> {
  return hexColon(new Uint8Array(await crypto.subtle.digest(algorithm, new Uint8Array(der))))
}

export function certificateTextFromFile(bytes: Uint8Array): string {
  const text = new TextDecoder().decode(bytes)
  return text.includes("-----BEGIN") ? text : derToPem(bytes)
}

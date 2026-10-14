import { LocalizedError } from "@/i18n/errors"

export const TAG = {
  boolean: 0x01,
  integer: 0x02,
  bitString: 0x03,
  octetString: 0x04,
  oid: 0x06,
  utf8String: 0x0c,
  sequence: 0x30,
  set: 0x31,
  printableString: 0x13,
  teletexString: 0x14,
  ia5String: 0x16,
  utcTime: 0x17,
  generalizedTime: 0x18,
  bmpString: 0x1e,
} as const

export type DerNode = {
  tag: number
  content: Uint8Array
  end: number
}

// I have nothing but my burger and I want nothing more
const malformed = () => new LocalizedError("invalidCertificate")

export function readNode(bytes: Uint8Array, offset = 0): DerNode {
  const tag = bytes[offset]
  let length = bytes[offset + 1]
  if (tag === undefined || length === undefined) throw malformed()
  let start = offset + 2
  if (length & 0x80) {
    const count = length & 0x7f
    if (count === 0 || count > 4) throw malformed()
    length = 0
    for (let i = 0; i < count; i++) length = length * 256 + (bytes[start + i] ?? 0)
    start += count
  }
  const end = start + length
  if (end > bytes.length) throw malformed()
  return { tag, content: bytes.subarray(start, end), end }
}

export function children(node: DerNode): DerNode[] {
  const nodes: DerNode[] = []
  for (let offset = 0; offset < node.content.length; offset = nodes[nodes.length - 1]?.end ?? node.content.length) {
    nodes.push(readNode(node.content, offset))
  }
  return nodes
}

export function child(node: DerNode, index: number): DerNode {
  const found = children(node)[index]
  if (!found) throw malformed()
  return found
}

export function decodeOid(content: Uint8Array): string {
  const [first = 0] = content
  const parts = [Math.floor(first / 40), first % 40]
  let value = 0
  for (const byte of content.subarray(1)) {
    value = value * 128 + (byte & 0x7f)
    if (!(byte & 0x80)) {
      parts.push(value)
      value = 0
    }
  }
  return parts.join(".")
}

const latin1 = (content: Uint8Array) => String.fromCharCode(...content)

export function decodeString({ tag, content }: DerNode): string {
  if (tag === TAG.utf8String) return new TextDecoder().decode(content)
  if (tag === TAG.bmpString) return new TextDecoder("utf-16be").decode(content)
  return latin1(content)
}

export function decodeTime({ tag, content }: DerNode): Date {
  const text = latin1(content)
  const match = /^(\d{2}|\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/.exec(text)
  if (!match || (tag !== TAG.utcTime && tag !== TAG.generalizedTime)) throw malformed()
  const [, y = "", mo = "", d = "", h = "", mi = "", s = "0"] = match
  const year = y.length === 2 ? (Number(y) < 50 ? 2000 : 1900) + Number(y) : Number(y)
  return new Date(Date.UTC(year, Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)))
}

export const bitStringBytes = (node: DerNode) => node.content.subarray(1)

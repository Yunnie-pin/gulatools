import { LocalizedError } from "@/i18n/errors"

export type SubnetInfo = {
  address: string
  prefix: number
  network: string
  broadcast: string
  netmask: string
  wildcard: string
  firstHost: string
  lastHost: string
  usableHosts: number
  totalAddresses: number
  binaryNetmask: string
}

// I have nothing but my burger and I want nothing more
const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/

function parseIpv4(text: string): number {
  const match = IPV4.exec(text)
  const octets = match?.slice(1).map(Number)
  if (!octets || octets.some((octet) => octet > 255)) throw new LocalizedError("invalidCidr")
  return octets.reduce((value, octet) => ((value << 8) | octet) >>> 0, 0)
}

const formatIpv4 = (value: number) => [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".")

const maskOf = (prefix: number) => (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0)

function prefixFromMask(mask: number): number {
  const prefix = Math.clz32(~mask >>> 0)
  if (maskOf(prefix) !== mask) throw new LocalizedError("invalidNetmask")
  return prefix
}

function parsePrefix(text: string): number {
  if (/^\d{1,2}$/.test(text) && Number(text) <= 32) return Number(text)
  if (IPV4.test(text)) return prefixFromMask(parseIpv4(text))
  throw new LocalizedError("invalidCidr")
}

export function parseSubnet(input: string): SubnetInfo {
  const [address = "", prefixText, ...rest] = input.trim().split(/\s*\/\s*|\s+/)
  if (rest.length) throw new LocalizedError("invalidCidr")
  const ip = parseIpv4(address)
  const prefix = prefixText === undefined ? 32 : parsePrefix(prefixText)

  const mask = maskOf(prefix)
  const network = (ip & mask) >>> 0
  const broadcast = (network | ~mask) >>> 0
  const totalAddresses = 2 ** (32 - prefix)
  const pointToPoint = prefix >= 31

  return {
    address: formatIpv4(ip),
    prefix,
    network: formatIpv4(network),
    broadcast: formatIpv4(broadcast),
    netmask: formatIpv4(mask),
    wildcard: formatIpv4(~mask >>> 0),
    firstHost: formatIpv4(pointToPoint ? network : network + 1),
    lastHost: formatIpv4(pointToPoint ? broadcast : broadcast - 1),
    usableHosts: pointToPoint ? totalAddresses : totalAddresses - 2,
    totalAddresses,
    binaryNetmask: [24, 16, 8, 0].map((shift) => ((mask >>> shift) & 255).toString(2).padStart(8, "0")).join("."),
  }
}

export type Ipv6Info = {
  address: string
  expanded: string
  prefix: number
  network: string
  firstAddress: string
  lastAddress: string
  totalAddresses: bigint
  subnets64: bigint | null
  type: Ipv6Type
  reverseDns: string
}

export type Ipv6Type =
  | "unspecified"
  | "loopback"
  | "ipv4Mapped"
  | "documentation"
  | "linkLocal"
  | "uniqueLocal"
  | "multicast"
  | "globalUnicast"

const ALL_ONES = (1n << 128n) - 1n

function parseIpv6(text: string): bigint {
  let address = text.replace(/%.*$/, "").toLowerCase()
  const ipv4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(address)?.[1]
  if (ipv4) {
    const value = parseIpv4(ipv4)
    address = `${address.slice(0, -ipv4.length)}${(value >>> 16).toString(16)}:${(value & 0xffff).toString(16)}`
  }
  const halves = address.split("::")
  if (halves.length > 2) throw new LocalizedError("invalidCidr")
  const [head, tail] = halves.map((half) => (half ? half.split(":") : []))
  const missing = 8 - (head?.length ?? 0) - (tail?.length ?? 0)
  if (tail === undefined ? missing !== 0 : missing < 1) throw new LocalizedError("invalidCidr")
  const groups = [...(head ?? []), ...Array<string>(tail === undefined ? 0 : missing).fill("0"), ...(tail ?? [])]
  if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) throw new LocalizedError("invalidCidr")
  return groups.reduce((value, group) => (value << 16n) | BigInt(Number.parseInt(group, 16)), 0n)
}

const groupsOf = (value: bigint) =>
  Array.from({ length: 8 }, (_, i) => Number((value >> BigInt(112 - i * 16)) & 0xffffn))

const expandIpv6 = (value: bigint) =>
  groupsOf(value)
    .map((group) => group.toString(16).padStart(4, "0"))
    .join(":")

function formatIpv6(value: bigint): string {
  const groups = groupsOf(value)
  let best = { start: -1, length: 1 }
  for (let i = 0; i < 8; ) {
    let end = i
    while (end < 8 && groups[end] === 0) end++
    if (end - i > best.length) best = { start: i, length: end - i }
    i = end === i ? i + 1 : end
  }
  const hex = groups.map((group) => group.toString(16))
  if (best.start < 0) return hex.join(":")
  return `${hex.slice(0, best.start).join(":")}::${hex.slice(best.start + best.length).join(":")}`
}

const inRange = (value: bigint, base: string, prefix: number) =>
  value >> BigInt(128 - prefix) === parseIpv6(base) >> BigInt(128 - prefix)

function classify(value: bigint): Ipv6Type {
  if (value === 0n) return "unspecified"
  if (value === 1n) return "loopback"
  if (inRange(value, "::ffff:0:0", 96)) return "ipv4Mapped"
  if (inRange(value, "2001:db8::", 32)) return "documentation"
  if (inRange(value, "fe80::", 10)) return "linkLocal"
  if (inRange(value, "fc00::", 7)) return "uniqueLocal"
  if (inRange(value, "ff00::", 8)) return "multicast"
  return "globalUnicast"
}

export function parseSubnet6(input: string): Ipv6Info {
  const [address = "", prefixText, ...rest] = input.trim().split(/\s*\/\s*/)
  if (rest.length) throw new LocalizedError("invalidCidr")
  if (prefixText !== undefined && !(/^\d{1,3}$/.test(prefixText) && Number(prefixText) <= 128)) {
    throw new LocalizedError("invalidCidr")
  }
  const ip = parseIpv6(address)
  const prefix = prefixText === undefined ? 128 : Number(prefixText)
  const hostBits = BigInt(128 - prefix)
  const mask = (ALL_ONES >> hostBits) << hostBits
  const network = ip & mask
  const last = network | (ALL_ONES ^ mask)

  return {
    address: formatIpv6(ip),
    expanded: expandIpv6(ip),
    prefix,
    network: `${formatIpv6(network)}/${prefix}`,
    firstAddress: formatIpv6(network),
    lastAddress: formatIpv6(last),
    totalAddresses: 1n << hostBits,
    subnets64: prefix <= 64 ? 1n << BigInt(64 - prefix) : null,
    type: classify(ip),
    reverseDns: `${[...expandIpv6(ip).replace(/:/g, "")].reverse().join(".")}.ip6.arpa`,
  }
}

export type AnySubnet = { version: 4; info: SubnetInfo } | { version: 6; info: Ipv6Info }

export const parseAnySubnet = (input: string): AnySubnet =>
  input.includes(":") ? { version: 6, info: parseSubnet6(input) } : { version: 4, info: parseSubnet(input) }

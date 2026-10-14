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

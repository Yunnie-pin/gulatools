import { describe, expect, it } from "vitest"
import { parseAnySubnet, parseSubnet, parseSubnet6 } from "./logic"

describe("parseSubnet", () => {
  it("derives the network range from any address inside it", () => {
    expect(parseSubnet("192.168.1.130/25")).toEqual({
      address: "192.168.1.130",
      prefix: 25,
      network: "192.168.1.128",
      broadcast: "192.168.1.255",
      netmask: "255.255.255.128",
      wildcard: "0.0.0.127",
      firstHost: "192.168.1.129",
      lastHost: "192.168.1.254",
      usableHosts: 126,
      totalAddresses: 128,
      binaryNetmask: "11111111.11111111.11111111.10000000",
    })
  })

  it("accepts a dotted netmask instead of a prefix length", () => {
    expect(parseSubnet("10.1.2.3 255.0.0.0")).toMatchObject({ prefix: 8, network: "10.0.0.0" })
  })

  it("treats a bare address as a single host", () => {
    expect(parseSubnet("8.8.8.8")).toMatchObject({ prefix: 32, usableHosts: 1, firstHost: "8.8.8.8" })
  })

  it("uses both addresses of a /31 point-to-point link (RFC 3021)", () => {
    expect(parseSubnet("10.0.0.0/31")).toMatchObject({ usableHosts: 2, firstHost: "10.0.0.0", lastHost: "10.0.0.1" })
  })

  it("stays unsigned at the top of the address space and for /0", () => {
    expect(parseSubnet("255.255.255.255/24").network).toBe("255.255.255.0")
    expect(parseSubnet("1.2.3.4/0")).toMatchObject({ network: "0.0.0.0", broadcast: "255.255.255.255" })
  })

  it("rejects invalid addresses, prefixes and non-contiguous masks", () => {
    expect(() => parseSubnet("256.1.1.1/24")).toThrow("Contoh")
    expect(() => parseSubnet("10.0.0.0/33")).toThrow("Contoh")
    expect(() => parseSubnet("10.0.0.0 255.0.255.0")).toThrow("berurutan")
  })
})

describe("parseSubnet6", () => {
  it("derives the network and range of an IPv6 prefix", () => {
    expect(parseSubnet6("2001:db8:abcd:12::1/48")).toEqual({
      address: "2001:db8:abcd:12::1",
      expanded: "2001:0db8:abcd:0012:0000:0000:0000:0001",
      prefix: 48,
      network: "2001:db8:abcd::/48",
      firstAddress: "2001:db8:abcd::",
      lastAddress: "2001:db8:abcd:ffff:ffff:ffff:ffff:ffff",
      totalAddresses: 2n ** 80n,
      subnets64: 65536n,
      type: "documentation",
      reverseDns: "1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.2.1.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa",
    })
  })

  // RFC 5952 section 4: lowercase, no leading zeros, :: replaces the longest (then first) run of 2+ zero groups
  it.each([
    ["2001:0DB8:0000:0000:0001:0000:0000:0001", "2001:db8::1:0:0:1"],
    ["2001:db8:0:1:1:1:1:1", "2001:db8:0:1:1:1:1:1"],
    ["2001:0:0:1:0:0:0:1", "2001:0:0:1::1"],
    ["0:0:0:0:0:0:0:0", "::"],
  ])("compresses %s to %s", (input, expected) => {
    expect(parseSubnet6(input).address).toBe(expected)
  })

  it("accepts embedded IPv4 and strips zone ids", () => {
    expect(parseSubnet6("::ffff:192.168.1.10")).toMatchObject({ address: "::ffff:c0a8:10a", type: "ipv4Mapped" })
    expect(parseSubnet6("fe80::1%eth0/64")).toMatchObject({ address: "fe80::1", type: "linkLocal" })
  })

  it.each([
    ["::1", "loopback"],
    ["fd12:3456::1", "uniqueLocal"],
    ["ff02::1", "multicast"],
    ["2606:4700::1111", "globalUnicast"],
  ])("classifies %s as %s", (input, type) => {
    expect(parseSubnet6(input).type).toBe(type)
  })

  it("rejects malformed addresses and prefixes", () => {
    for (const input of ["2001:db8::1::1", "2001:db8:1:2:3:4:5:6:7", "12345::", "2001:db8::/129", "1:2:3:4:5:6:7"]) {
      expect(() => parseSubnet6(input), input).toThrow("Contoh")
    }
  })
})

describe("parseAnySubnet", () => {
  it("routes by address family", () => {
    expect(parseAnySubnet("10.0.0.0/8").version).toBe(4)
    expect(parseAnySubnet("2001:db8::/32").version).toBe(6)
  })
})

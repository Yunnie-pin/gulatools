import { describe, expect, it } from "vitest"
import { parseSubnet } from "./logic"

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

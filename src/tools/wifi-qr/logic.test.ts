import { describe, expect, it } from "vitest"
import { type WifiConfig, wifiPayload } from "./logic"

const config = (patch: Partial<WifiConfig>): WifiConfig => ({
  ssid: "Kopi Gula",
  password: "rahasia123",
  security: "WPA",
  hidden: false,
  ...patch,
})

describe("wifiPayload", () => {
  it("builds the WIFI: string that Android and iOS cameras join from", () => {
    expect(wifiPayload(config({}))).toBe("WIFI:T:WPA;S:Kopi Gula;P:rahasia123;;")
  })

  it("escapes separators, so a ; in the password does not end the field early", () => {
    expect(wifiPayload(config({ ssid: 'a"b', password: "p;a,s:s\\word" }))).toBe(
      'WIFI:T:WPA;S:a\\"b;P:p\\;a\\,s\\:s\\\\word;;',
    )
  })

  it("omits the password for open networks and flags hidden ones", () => {
    expect(wifiPayload(config({ security: "nopass", hidden: true }))).toBe("WIFI:T:nopass;S:Kopi Gula;H:true;;")
  })

  it("rejects a WPA password that phones would refuse to join with", () => {
    expect(() => wifiPayload(config({ password: "short" }))).toThrow("8–63")
    expect(wifiPayload(config({ security: "WEP", password: "abcde" }))).toContain("P:abcde")
  })

  it("requires an SSID", () => {
    expect(() => wifiPayload(config({ ssid: "" }))).toThrow("SSID")
  })
})

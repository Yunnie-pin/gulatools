import { describe, expect, it } from "vitest"
import { parseUserAgent } from "./logic"

describe("parseUserAgent", () => {
  it("reads desktop Chrome on Windows", () => {
    expect(
      parseUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      ),
    ).toEqual({
      browser: "Chrome 131.0.0.0",
      engine: "Blink 131.0.0.0",
      os: "Windows 10",
      device: "",
      deviceType: "desktop",
      cpu: "amd64",
    })
  })

  it("reads Safari on iPhone as a mobile Apple device", () => {
    const info = parseUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    )
    expect(info).toMatchObject({
      browser: "Mobile Safari 17.5",
      os: "iOS 17.5",
      device: "Apple iPhone",
      deviceType: "mobile",
    })
  })

  it("reads Firefox on Android", () => {
    const info = parseUserAgent("Mozilla/5.0 (Android 14; Mobile; rv:128.0) Gecko/128.0 Firefox/128.0")
    expect(info).toMatchObject({ browser: "Firefox 128.0", engine: "Gecko 128.0", os: "Android 14" })
  })

  it("returns empty fields for unknown agents instead of throwing", () => {
    expect(parseUserAgent("curl/8.5.0")).toMatchObject({ browser: "", os: "", device: "" })
  })
})

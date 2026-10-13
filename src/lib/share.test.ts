import { describe, expect, it } from "vitest"
import { buildShareUrl, decodeShare, encodeShare, sharedFromHash } from "./share"

const location = { origin: "https://gulatools.dev", pathname: "/json-formatter" }

describe("share", () => {
  it("round-trips unicode text", async () => {
    const text = '{"gula":"manis — ünïcödé"}'
    expect(await decodeShare(await encodeShare(text))).toBe(text)
  })

  it("compresses repetitive input", async () => {
    const text = "gula ".repeat(2000)
    expect((await encodeShare(text)).length).toBeLessThan(text.length / 20)
  })

  it("is url-safe", async () => {
    expect(await encodeShare("??>>~~".repeat(50))).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it("builds a hash url and reads it back", async () => {
    const url = await buildShareUrl("halo", location)
    expect(url.startsWith("https://gulatools.dev/json-formatter#s=")).toBe(true)
    const encoded = sharedFromHash(new URL(url).hash)
    expect(encoded && (await decodeShare(encoded))).toBe("halo")
  })

  it("ignores unrelated hashes", () => {
    expect(sharedFromHash("#section")).toBeNull()
  })

  it("rejects broken links", async () => {
    await expect(decodeShare("AAAA")).rejects.toThrow("rusak")
  })

  it("refuses inputs that would make the url too long", async () => {
    const noise = Array.from(crypto.getRandomValues(new Uint8Array(40_000)), (b) =>
      String.fromCharCode(33 + (b % 90)),
    ).join("")
    await expect(buildShareUrl(noise, location)).rejects.toThrow("terlalu besar")
  })
})

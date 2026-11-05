import { describe, expect, it } from "vitest"
import {
  buildStateShareUrl,
  decodeShare,
  decodeSharedState,
  encodeShare,
  sharedFromHash,
  sharedStateFromHash,
  stateFromQuery,
} from "./share"

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

  it("still reads legacy #s= links that carried only the input", async () => {
    const encoded = sharedFromHash(`#s=${await encodeShare("halo")}`)
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
    await expect(buildStateShareUrl({ input: noise }, location)).rejects.toThrow("terlalu besar")
  })
})

describe("tool state share", () => {
  it("round-trips a whole tool state through the URL hash", async () => {
    const state = { mode: "decode", encoding: "hex", input: "gula ünïcödé", options: { wrap: true } }
    const url = await buildStateShareUrl(state, location)
    const hash = new URL(url).hash
    expect(sharedFromHash(hash)).toBeNull()
    expect(await decodeSharedState(sharedStateFromHash(hash) ?? "")).toEqual(state)
  })

  it("rejects payloads that are not a state object", async () => {
    await expect(decodeSharedState(await encodeShare("[1,2]"))).rejects.toThrow()
  })

  it("reads deep-link options from the query string, keeping non-JSON values as text", () => {
    expect(stateFromQuery("?mode=decode&count=5&flag=true&name=%22quoted%22&text=gula manis")).toEqual({
      mode: "decode",
      count: 5,
      flag: true,
      name: "quoted",
      text: "gula manis",
    })
  })
})

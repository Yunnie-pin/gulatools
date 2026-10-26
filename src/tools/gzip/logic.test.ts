import { gzipSync } from "node:zlib"
import { describe, expect, it } from "vitest"
import { base64ToBytes } from "@/lib/bytes"
import { compress, decompress, detectFormat } from "./logic"

const TEXT = "gula gula gula manis 🍬 ".repeat(20)

describe("gzip", () => {
  it.each(["gzip", "deflate", "deflate-raw"] as const)(
    "round-trips %s and detects it from the header",
    async (format) => {
      const packed = await compress(TEXT, format)
      expect(base64ToBytes(packed).length).toBeLessThan(new TextEncoder().encode(TEXT).length)
      expect(await decompress(packed)).toEqual({ text: TEXT, format })
    },
  )

  it("reads gzip produced by zlib, the library behind the gzip CLI and most servers", async () => {
    expect((await decompress(gzipSync("hello").toString("base64"))).text).toBe("hello")
  })

  it("recognises the zlib header used by deflate", () => {
    expect(detectFormat(new Uint8Array([0x78, 0x9c]))).toBe("deflate")
    expect(detectFormat(new Uint8Array([0x1f, 0x8b]))).toBe("gzip")
    expect(detectFormat(new Uint8Array([0xcb, 0x48]))).toBe("deflate-raw")
  })

  it("reports corrupt data instead of returning garbage", async () => {
    await expect(decompress("H4sIAAAAAAAAA8tIzcnJ")).rejects.toThrow("gzip")
  })
})

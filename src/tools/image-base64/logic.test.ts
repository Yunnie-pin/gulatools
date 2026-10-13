import { describe, expect, it } from "vitest"
import { extensionFor, snippets, toDataUrl, typeOf } from "./logic"

const PIXEL = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

describe("toDataUrl", () => {
  it("wraps raw base64 with the chosen type", () => {
    expect(toDataUrl(PIXEL, "image/png")).toBe(`data:image/png;base64,${PIXEL}`)
  })

  it("keeps an existing data uri and strips whitespace", () => {
    expect(toDataUrl(`data:image/webp;base64,${PIXEL.slice(0, 10)}\n${PIXEL.slice(10)}`, "image/png")).toBe(
      `data:image/webp;base64,${PIXEL}`,
    )
  })

  it("rejects data uris that are not images", () => {
    expect(() => toDataUrl("data:text/plain;base64,aGFsbw==", "image/png")).toThrow("bukan gambar")
  })

  it("rejects garbage", () => {
    expect(() => toDataUrl("bukan base64!", "image/png")).toThrow("Bukan data URI atau Base64 yang valid")
  })
})

describe("snippets", () => {
  it("derives base64, css and html", () => {
    const result = snippets(`data:image/png;base64,${PIXEL}`)
    expect(result.base64).toBe(PIXEL)
    expect(result.css).toBe(`background-image: url("data:image/png;base64,${PIXEL}");`)
    expect(result.html).toBe(`<img src="data:image/png;base64,${PIXEL}" alt="" />`)
  })

  it("reads the type and extension", () => {
    expect(typeOf("data:image/svg+xml;base64,AA==")).toBe("image/svg+xml")
    expect(extensionFor("image/svg+xml")).toBe("svg")
    expect(extensionFor("image/jpeg")).toBe("jpeg")
  })
})

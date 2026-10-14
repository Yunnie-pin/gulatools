import { describe, expect, it } from "vitest"
import { checkContrast } from "./logic"

describe("checkContrast", () => {
  it("gives the maximum ratio for black on white", () => {
    expect(checkContrast("black", "white").ratio).toBeCloseTo(21, 5)
  })

  it("is symmetric, since WCAG compares relative luminance", () => {
    expect(checkContrast("#ff6b5e", "#1a1a1a").ratio).toBeCloseTo(checkContrast("#1a1a1a", "#ff6b5e").ratio, 10)
  })

  it("separates normal text from large text at the AA threshold", () => {
    const { ratio, passes } = checkContrast("#777777", "#ffffff")
    expect(ratio).toBeCloseTo(4.48, 2)
    expect(passes).toEqual({ aaNormal: false, aaLarge: true, aaaNormal: false, aaaLarge: false, nonText: true })
  })

  it("blends a translucent foreground over the background before measuring", () => {
    const result = checkContrast("rgb(0 0 0 / 50%)", "white")
    expect(result.foreground).toBe("#808080")
    expect(result.ratio).toBeCloseTo(checkContrast("rgb(127.5 127.5 127.5)", "white").ratio, 5)
  })

  it("rejects unknown colors", () => {
    expect(() => checkContrast("not-a-color", "white")).toThrow("Warna tidak dikenali")
  })
})

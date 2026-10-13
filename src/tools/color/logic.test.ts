import { describe, expect, it } from "vitest"
import { convertColor } from "./logic"

describe("convertColor", () => {
  it("converts hex to every format", () => {
    expect(convertColor("#ff6b5e")).toMatchObject({
      hex: "#ff6b5e",
      hex8: "#ff6b5eff",
      rgb: "rgb(255, 107, 94)",
      hsl: "hsl(4.84, 100%, 68.43%)",
      oklch: "oklch(70.9% 0.183 27.7)",
    })
  })

  it("accepts named and functional colors", () => {
    expect(convertColor("coral").hex).toBe("#ff7f50")
    expect(convertColor("rgb(0 0 255)").hex).toBe("#0000ff")
  })

  it("keeps alpha", () => {
    expect(convertColor("#00000080").oklch).toBe("oklch(0.0% 0.000 0.0 / 0.5)")
  })

  it("measures contrast", () => {
    const { contrast } = convertColor("#000")
    expect(contrast.white).toBeCloseTo(21)
    expect(contrast.black).toBeCloseTo(1)
  })

  it("rejects unknown colors", () => {
    expect(() => convertColor("bukan warna")).toThrow("tidak dikenali")
  })
})

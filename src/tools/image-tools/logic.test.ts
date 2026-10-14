import { describe, expect, it } from "vitest"
import { outputName, savings, targetSize } from "./logic"

describe("targetSize", () => {
  it("keeps the aspect ratio when resizing", () => {
    expect(targetSize({ width: 4000, height: 3000 }, 1200)).toEqual({ width: 1200, height: 900 })
  })

  it("never upscales, since that only adds bytes without detail", () => {
    expect(targetSize({ width: 800, height: 600 }, 2000)).toEqual({ width: 800, height: 600 })
  })

  it("falls back to the original width for empty input and stays at least 1px", () => {
    expect(targetSize({ width: 800, height: 600 }, 0)).toEqual({ width: 800, height: 600 })
    expect(targetSize({ width: 1000, height: 1 }, 10)).toEqual({ width: 10, height: 1 })
  })
})

describe("outputName", () => {
  it("swaps the extension for the new format", () => {
    expect(outputName("foto.liburan.PNG", "webp")).toBe("foto.liburan.webp")
    expect(outputName("scan", "jpeg")).toBe("scan.jpg")
  })
})

describe("savings", () => {
  it("reports how much smaller the output is, negative when it grew", () => {
    expect(savings(1000, 250)).toBe(75)
    expect(savings(1000, 1200)).toBe(-20)
  })
})

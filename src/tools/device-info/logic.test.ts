import { describe, expect, it } from "vitest"
import { cleanRenderer } from "./logic"

describe("cleanRenderer", () => {
  it.each([
    ["ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 (0x00002504) Direct3D11 vs_5_0 ps_5_0, D3D11)", "NVIDIA GeForce RTX 3060"],
    [
      "ANGLE (Intel, Intel(R) UHD Graphics 620 (0x00005917) Direct3D11 vs_5_0 ps_5_0, D3D11)",
      "Intel(R) UHD Graphics 620",
    ],
    ["ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)", "Apple M2"],
    ["ANGLE (AMD, AMD Radeon RX 6600 OpenGL 4.6)", "AMD Radeon RX 6600"],
  ])("reduces Chrome's ANGLE string %s to the GPU model people recognize", (raw, expected) => {
    expect(cleanRenderer(raw)).toBe(expected)
  })

  it("leaves renderers that are already plain, like Safari's and Firefox's, untouched", () => {
    expect(cleanRenderer("Apple GPU")).toBe("Apple GPU")
    expect(cleanRenderer("Mali-G78")).toBe("Mali-G78")
  })
})

import { describe, expect, it } from "vitest"
import { glassCss, gradientCss, hexToRgba, shadowCss, toCssText, toStyle } from "./logic"

describe("gradientCss", () => {
  it("orders stops by position so dragging a stop past another still renders correctly", () => {
    expect(
      gradientCss({
        type: "linear",
        angle: 135,
        stops: [
          { color: "#7c5cff", position: 100 },
          { color: "#ff6b5e", position: 0 },
        ],
      }),
    ).toEqual([["background", "linear-gradient(135deg, #ff6b5e 0%, #7c5cff 100%)"]])
  })

  it("writes radial gradients without an angle", () => {
    const [[, value] = ["", ""]] = gradientCss({ type: "radial", angle: 90, stops: [{ color: "#000", position: 0 }] })
    expect(value).toBe("radial-gradient(circle, #000 0%)")
  })
})

describe("shadowCss", () => {
  it("joins layers and puts inset first, as CSS requires", () => {
    expect(
      shadowCss([
        { x: 0, y: 8, blur: 24, spread: -4, color: "#000000", opacity: 0.25, inset: false },
        { x: 0, y: 1, blur: 0, spread: 0, color: "#ffffff", opacity: 0.6, inset: true },
      ]),
    ).toEqual([["box-shadow", "0px 8px 24px -4px rgba(0, 0, 0, 0.25), inset 0px 1px 0px 0px rgba(255, 255, 255, 0.6)"]])
  })

  it("falls back to none when every layer is removed", () => {
    expect(shadowCss([])).toEqual([["box-shadow", "none"]])
  })
})

describe("glassCss", () => {
  it("includes the -webkit- prefix Safari still needs for backdrop-filter", () => {
    const css = toCssText(
      glassCss({ tint: "#ffffff", opacity: 0.15, blur: 16, saturation: 180, borderOpacity: 0.3, radius: 20 }),
    )
    expect(css).toBe(
      [
        "background: rgba(255, 255, 255, 0.15);",
        "backdrop-filter: blur(16px) saturate(180%);",
        "-webkit-backdrop-filter: blur(16px) saturate(180%);",
        "border: 1px solid rgba(255, 255, 255, 0.3);",
        "border-radius: 20px;",
      ].join("\n"),
    )
  })
})

describe("helpers", () => {
  it("converts hex to rgba and rounds alpha", () => {
    expect(hexToRgba("#ff6b5e", 0.333333)).toBe("rgba(255, 107, 94, 0.33)")
  })

  it("maps declarations to React style keys, including vendor prefixes", () => {
    expect(
      toStyle([
        ["box-shadow", "none"],
        ["-webkit-backdrop-filter", "blur(4px)"],
      ]),
    ).toEqual({ boxShadow: "none", WebkitBackdropFilter: "blur(4px)" })
  })
})

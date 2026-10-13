import { type Color, converter, formatHex, formatHex8, formatHsl, formatRgb, parse, wcagContrast } from "culori"

const toOklch = converter("oklch")

export type ColorInfo = {
  hex: string
  hex8: string
  rgb: string
  hsl: string
  oklch: string
  contrast: { white: number; black: number }
}

function formatOklch(color: Color): string {
  const { l, c, h = 0, alpha = 1 } = toOklch(color)
  const base = `${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)}`
  return `oklch(${alpha < 1 ? `${base} / ${Number(alpha.toFixed(2))}` : base})`
}

export function convertColor(input: string): ColorInfo {
  const color = parse(input.trim())
  if (!color) throw new Error("Warna tidak dikenali. Contoh: #ff6b5e, rgb(255 107 94), hsl(5 100% 68%), coral")
  return {
    hex: formatHex(color),
    hex8: formatHex8(color),
    rgb: formatRgb(color),
    hsl: formatHsl(color),
    oklch: formatOklch(color),
    contrast: { white: wcagContrast(color, "white"), black: wcagContrast(color, "black") },
  }
}

export const WCAG_AA = 4.5

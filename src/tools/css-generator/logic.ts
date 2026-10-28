import type { CSSProperties } from "react"

export type Declaration = [property: string, value: string]

export type GradientStop = { color: string; position: number }

export type GradientConfig = { type: "linear" | "radial"; angle: number; stops: GradientStop[] }

export type ShadowLayer = {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export type GlassConfig = {
  tint: string
  opacity: number
  blur: number
  saturation: number
  borderOpacity: number
  radius: number
}

const round = (value: number) => Math.round(value * 100) / 100

export function hexToRgba(hex: string, alpha: number): string {
  const value = Number.parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${round(alpha)})`
}

export function gradientCss({ type, angle, stops }: GradientConfig): Declaration[] {
  const list = [...stops]
    .sort((a, b) => a.position - b.position)
    .map(({ color, position }) => `${color} ${position}%`)
    .join(", ")
  const value = type === "linear" ? `linear-gradient(${angle}deg, ${list})` : `radial-gradient(circle, ${list})`
  return [["background", value]]
}

export function shadowCss(layers: ShadowLayer[]): Declaration[] {
  const value = layers
    .map(({ x, y, blur, spread, color, opacity, inset }) =>
      [inset && "inset", `${x}px ${y}px ${blur}px ${spread}px`, hexToRgba(color, opacity)].filter(Boolean).join(" "),
    )
    .join(", ")
  return [["box-shadow", value || "none"]]
}

export function glassCss({ tint, opacity, blur, saturation, borderOpacity, radius }: GlassConfig): Declaration[] {
  const filter = `blur(${blur}px) saturate(${saturation}%)`
  return [
    ["background", hexToRgba(tint, opacity)],
    ["backdrop-filter", filter],
    ["-webkit-backdrop-filter", filter],
    ["border", `1px solid ${hexToRgba("#ffffff", borderOpacity)}`],
    ["border-radius", `${radius}px`],
  ]
}

export const toCssText = (declarations: Declaration[]) =>
  declarations.map(([property, value]) => `${property}: ${value};`).join("\n")

const camelCase = (property: string) =>
  property.replace(/^-webkit-/, "Webkit-").replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())

export const toStyle = (declarations: Declaration[]): CSSProperties =>
  Object.fromEntries(declarations.map(([property, value]) => [camelCase(property), value]))

import { converter, formatHex, parse, wcagContrast } from "culori"
import { LocalizedError } from "@/i18n/errors"

export const CHECKS = [
  { id: "aaNormal", level: "AA", min: 4.5 },
  { id: "aaLarge", level: "AA", min: 3 },
  { id: "aaaNormal", level: "AAA", min: 7 },
  { id: "aaaLarge", level: "AAA", min: 4.5 },
  { id: "nonText", level: "AA", min: 3 },
] as const

export type CheckId = (typeof CHECKS)[number]["id"]

export type ContrastResult = {
  ratio: number
  foreground: string
  background: string
  passes: Record<CheckId, boolean>
}

// I have nothing but my burger and I want nothing more
const toRgb = converter("rgb")

function parseRgb(input: string) {
  const color = parse(input.trim())
  if (!color) throw new LocalizedError("unknownColor")
  return toRgb(color)
}

const over = (top: number, bottom: number, alpha: number) => top * alpha + bottom * (1 - alpha)

export function checkContrast(foregroundInput: string, backgroundInput: string): ContrastResult {
  const background = { ...parseRgb(backgroundInput), alpha: 1 }
  const top = parseRgb(foregroundInput)
  const alpha = top.alpha ?? 1
  const foreground = {
    mode: "rgb" as const,
    r: over(top.r, background.r, alpha),
    g: over(top.g, background.g, alpha),
    b: over(top.b, background.b, alpha),
  }
  const ratio = wcagContrast(foreground, background)

  return {
    ratio,
    foreground: formatHex(foreground),
    background: formatHex(background),
    passes: Object.fromEntries(CHECKS.map(({ id, min }) => [id, ratio >= min])) as Record<CheckId, boolean>,
  }
}

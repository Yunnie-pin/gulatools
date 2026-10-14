import { optimize } from "svgo/browser"
import { LocalizedError } from "@/i18n/errors"

export type SvgOptions = { precision: number; multipass: boolean; pretty: boolean }

// I have nothing but my burger and I want nothing more
export const byteSize = (text: string) => new TextEncoder().encode(text).length

export function optimizeSvg(input: string, { precision, multipass, pretty }: SvgOptions): string {
  try {
    return optimize(input, { multipass, floatPrecision: precision, js2svg: { pretty, indent: 2 } }).data
  } catch (error) {
    throw new LocalizedError("invalidSvg", error instanceof Error ? error.message : String(error))
  }
}

export const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

import { describe, expect, it } from "vitest"
import { byteSize, optimizeSvg, type SvgOptions } from "./logic"

const OPTIONS: SvgOptions = { precision: 3, multipass: true, pretty: false }

const EDITOR_EXPORT = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Some Editor 1.0 -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <metadata>junk</metadata>
  <g>
    <rect x="2.123456" y="2.987654" width="20" height="20" fill="#ff0000" />
  </g>
</svg>`

describe("optimizeSvg", () => {
  it("strips editor cruft and shrinks the file", () => {
    const output = optimizeSvg(EDITOR_EXPORT, OPTIONS)
    expect(output).not.toMatch(/<\?xml|<!--|metadata|<g>/)
    expect(byteSize(output)).toBeLessThan(byteSize(EDITOR_EXPORT) / 2)
  })

  it("keeps the viewBox so the icon still scales", () => {
    expect(optimizeSvg(EDITOR_EXPORT, OPTIONS)).toContain('viewBox="0 0 24 24"')
  })

  it("rounds coordinates to the chosen precision", () => {
    expect(optimizeSvg(EDITOR_EXPORT, { ...OPTIONS, precision: 1 })).toContain('d="M2.1 3h20v20h-20z"')
    expect(optimizeSvg(EDITOR_EXPORT, OPTIONS)).toContain('d="M2.123 2.988h20v20h-20z"')
  })

  it("can pretty-print for readability", () => {
    expect(optimizeSvg(EDITOR_EXPORT, { ...OPTIONS, pretty: true }).split("\n").length).toBeGreaterThan(2)
  })

  it("explains parse errors", () => {
    expect(() => optimizeSvg("<svg><g></svg>", OPTIONS)).toThrow("SVG tidak valid")
  })
})

describe("byteSize", () => {
  it("counts UTF-8 bytes, not characters", () => {
    expect(byteSize("é")).toBe(2)
  })
})

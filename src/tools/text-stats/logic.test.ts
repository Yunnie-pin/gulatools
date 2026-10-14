import { describe, expect, it } from "vitest"
import { analyzeText, formatCodePoint } from "./logic"

const ch = (...codePoints: number[]) => String.fromCodePoint(...codePoints)
const ZWSP = ch(0x200b)
const NBSP = ch(0xa0)
const RLO = ch(0x202e)
const FAMILY = ch(0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467)

describe("analyzeText", () => {
  it("separates user-perceived characters from code points, UTF-16 units and bytes", () => {
    const stats = analyzeText(`e${ch(0x301)} ${FAMILY}`)
    expect(stats).toMatchObject({ graphemes: 3, codePoints: 8, utf16Units: 11, utf8Bytes: 22 })
  })

  it("counts words and lines across line ending styles", () => {
    expect(analyzeText("gula manis\r\nkopi\npahit")).toMatchObject({ words: 4, lines: 3 })
    expect(analyzeText("")).toMatchObject({ words: 0, lines: 0, graphemes: 0 })
  })

  it("reports hidden characters with their first position and a count", () => {
    const { hidden } = analyzeText(`ab${ZWSP}c\nx${ZWSP}y${NBSP}`)
    expect(hidden).toEqual([
      { codePoint: 0x200b, name: "ZERO WIDTH SPACE", count: 2, line: 1, column: 3, bidi: false },
      { codePoint: 0xa0, name: "NO-BREAK SPACE", count: 1, line: 2, column: 4, bidi: false },
    ])
  })

  it("flags bidi controls used in Trojan Source attacks", () => {
    expect(analyzeText(`if (admin) ${RLO}`).hidden[0]).toMatchObject({ name: "RIGHT-TO-LEFT OVERRIDE", bidi: true })
  })

  it("does not treat joiners inside emoji sequences as hidden", () => {
    expect(analyzeText(FAMILY).hidden).toEqual([])
  })

  it("cleans hidden characters, turning odd spaces into plain spaces", () => {
    expect(analyzeText(`a${ZWSP}b${NBSP}c ${FAMILY}\n`).cleaned).toBe(`ab c ${FAMILY}\n`)
  })

  it("keeps ordinary whitespace visible", () => {
    expect(analyzeText("a\tb c\n").hidden).toEqual([])
  })
})

describe("formatCodePoint", () => {
  it("pads to four hex digits", () => {
    expect(formatCodePoint(0xa0)).toBe("U+00A0")
    expect(formatCodePoint(0x1f36c)).toBe("U+1F36C")
  })
})

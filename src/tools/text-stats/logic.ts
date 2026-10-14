export type HiddenChar = {
  codePoint: number
  name: string
  count: number
  line: number
  column: number
  bidi: boolean
}

export type TextStats = {
  graphemes: number
  codePoints: number
  utf16Units: number
  utf8Bytes: number
  words: number
  lines: number
  hidden: HiddenChar[]
  cleaned: string
}

const NAMES: Record<number, string> = {
  160: "NO-BREAK SPACE",
  173: "SOFT HYPHEN",
  1564: "ARABIC LETTER MARK",
  4447: "HANGUL CHOSEONG FILLER",
  4448: "HANGUL JUNGSEONG FILLER",
  6158: "MONGOLIAN VOWEL SEPARATOR",
  8203: "ZERO WIDTH SPACE",
  8204: "ZERO WIDTH NON-JOINER",
  8205: "ZERO WIDTH JOINER",
  8206: "LEFT-TO-RIGHT MARK",
  8207: "RIGHT-TO-LEFT MARK",
  8234: "LEFT-TO-RIGHT EMBEDDING",
  8235: "RIGHT-TO-LEFT EMBEDDING",
  8236: "POP DIRECTIONAL FORMATTING",
  8237: "LEFT-TO-RIGHT OVERRIDE",
  8238: "RIGHT-TO-LEFT OVERRIDE",
  8239: "NARROW NO-BREAK SPACE",
  8287: "MEDIUM MATHEMATICAL SPACE",
  8288: "WORD JOINER",
  8294: "LEFT-TO-RIGHT ISOLATE",
  8295: "RIGHT-TO-LEFT ISOLATE",
  8296: "FIRST STRONG ISOLATE",
  8297: "POP DIRECTIONAL ISOLATE",
  12288: "IDEOGRAPHIC SPACE",
  12644: "HANGUL FILLER",
  65279: "ZERO WIDTH NO-BREAK SPACE (BOM)",
  65440: "HALFWIDTH HANGUL FILLER",
}

const HIDDEN = /[\p{Cf}\p{Cc}\p{Zs}\u115f\u1160\u3164\uffa0]/u
const VISIBLE = new Set([0x20, 0x09, 0x0a, 0x0d])
const SPACE = /\p{Zs}/u
const CONTROL = /\p{Cc}/u
const BIDI = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u
const LINE_BREAK = /^(\r\n|\r|\n)$/
const EMOJI = /\p{Extended_Pictographic}/u

// I have nothing but my burger and I want nothing more
const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
const wordSegmenter = new Intl.Segmenter(undefined, { granularity: "word" })

const nameOf = (char: string, codePoint: number) =>
  NAMES[codePoint] ?? (CONTROL.test(char) ? "CONTROL" : SPACE.test(char) ? "SPACE" : "FORMAT CHARACTER")

const isHidden = (char: string, codePoint: number) => !VISIBLE.has(codePoint) && HIDDEN.test(char)

/** ZWJ dan sejenisnya di dalam satu grapheme emoji (mis. keluarga, bendera) adalah bagian sah dari emoji itu. */
const isEmojiSequence = (grapheme: string) => grapheme.length > 1 && EMOJI.test(grapheme)

export function analyzeText(text: string): TextStats {
  const hidden = new Map<number, HiddenChar>()
  let graphemes = 0
  let line = 1
  let column = 0
  let cleaned = ""

  for (const { segment } of graphemeSegmenter.segment(text)) {
    graphemes++
    if (LINE_BREAK.test(segment)) {
      cleaned += segment
      line++
      column = 0
      continue
    }
    column++
    if (isEmojiSequence(segment)) {
      cleaned += segment
      continue
    }
    for (const char of segment) {
      const codePoint = char.codePointAt(0) ?? 0
      if (!isHidden(char, codePoint)) {
        cleaned += char
        continue
      }
      if (SPACE.test(char)) cleaned += " "
      const seen = hidden.get(codePoint)
      if (seen) seen.count++
      else
        hidden.set(codePoint, {
          codePoint,
          name: nameOf(char, codePoint),
          count: 1,
          line,
          column,
          bidi: BIDI.test(char),
        })
    }
  }

  return {
    graphemes,
    codePoints: [...text].length,
    utf16Units: text.length,
    utf8Bytes: new TextEncoder().encode(text).length,
    words: [...wordSegmenter.segment(text)].filter((part) => part.isWordLike).length,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    hidden: [...hidden.values()],
    cleaned,
  }
}

export const formatCodePoint = (codePoint: number) => `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`

import { describe, expect, it } from "vitest"
import { LOCALES } from "@/i18n/locale"
import { decodeText, encodeText } from "./base64/logic"
import { messages as base64 } from "./base64/messages"
import { transformEntities } from "./html-entity/logic"
import { messages as htmlEntity } from "./html-entity/messages"
import { messages as regex } from "./regex/messages"
import { slugify } from "./slug/logic"
import { messages as slug } from "./slug/messages"
import { analyzeText } from "./text-stats/logic"
import { messages as textStats } from "./text-stats/messages"
import { transformUrl } from "./url-encoder/logic"
import { messages as urlEncoder } from "./url-encoder/messages"

describe.each(LOCALES)("%s samples still demonstrate each tool", (locale) => {
  it("text stats: keeps the zero-width space and no-break space the sample is meant to reveal", () => {
    const names = analyzeText(textStats[locale].sample).hidden.map((char) => char.codePoint)
    expect(names).toEqual([0x200b, 0xa0])
  })

  it("slug: turns every sample line into a non-empty slug", () => {
    for (const line of slug[locale].sample.split("\n")) expect(slugify(line, "-", true), line).not.toBe("")
  })

  it("regex: offers three email addresses for the default pattern", () => {
    expect(regex[locale].sample.match(/[\w.]+@[\w.]+/g)).toHaveLength(3)
  })

  it("base64 and url encoder: round-trip the localized text", () => {
    for (const encoding of ["base64", "base32", "base58", "hex"] as const) {
      expect(decodeText(encodeText(base64[locale].sample, encoding), encoding)).toBe(base64[locale].sample)
    }
    const sample = urlEncoder[locale].sample
    expect(transformUrl(transformUrl(sample, "component"), "decode")).toBe(sample)
  })

  it("html entity: the decode sample mixes named and numeric entities, and the encode sample needs escaping", () => {
    for (const entity of ["&lt;", "&amp;", "&mdash;", "&copy;", "&#x1F36C;"]) {
      expect(htmlEntity[locale].encodedSample).toContain(entity)
    }
    expect(transformEntities(htmlEntity[locale].sample, "encode")).toContain("&amp;")
  })
})

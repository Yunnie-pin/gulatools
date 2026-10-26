import { describe, expect, it } from "vitest"
import { slugify, slugifyLines } from "./logic"

describe("slugify", () => {
  it("produces URL-safe lowercase slugs", () => {
    expect(slugify("  Hello, World! 2026  ", "-", true)).toBe("hello-world-2026")
  })

  it("transliterates accents and letters that do not decompose", () => {
    expect(slugify("Crème Brûlée à São Paulo", "-", true)).toBe("creme-brulee-a-sao-paulo")
    expect(slugify("Straße Øresund Łódź", "-", true)).toBe("strasse-oresund-lodz")
  })

  it("drops apostrophes instead of splitting words on them", () => {
    expect(slugify("Don't stop", "-", true)).toBe("dont-stop")
  })

  it("respects the separator and case options", () => {
    expect(slugify("Gula Tools v2", "_", false)).toBe("Gula_Tools_v2")
    expect(slugify("a -- b", ".", true)).toBe("a.b")
  })

  it("converts each line separately", () => {
    expect(slugifyLines("Satu Dua\nTiga", "-", true)).toBe("satu-dua\ntiga")
  })
})

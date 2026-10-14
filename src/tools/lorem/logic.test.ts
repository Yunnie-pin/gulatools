import { describe, expect, it } from "vitest"
import { rng } from "@/lib/random"
import { generateLorem, type LoremOptions } from "./logic"

const generate = (options: Partial<LoremOptions>, seed = 1) =>
  generateLorem({ unit: "paragraphs", count: 3, classic: true, ...options }, rng(seed))

describe("generateLorem", () => {
  it("returns exactly the requested number of units", () => {
    expect(generate({ unit: "words", count: 37 }).split(" ")).toHaveLength(37)
    expect(generate({ unit: "sentences", count: 5 }).match(/\./g)).toHaveLength(5)
    expect(generate({ unit: "paragraphs", count: 4 }).split("\n\n")).toHaveLength(4)
  })

  it("starts with the classic opening only when asked", () => {
    expect(generate({ unit: "sentences", count: 2 })).toMatch(
      /^Lorem ipsum dolor sit amet, consectetur adipiscing elit\. /,
    )
    expect(generate({ unit: "words", count: 3 })).toBe("Lorem ipsum dolor")
    expect(generate({ unit: "sentences", count: 2, classic: false }, 7)).not.toMatch(/^Lorem ipsum dolor sit amet/)
  })

  it("builds capitalized sentences that end with a period", () => {
    for (const s of generate({ unit: "sentences", count: 20, classic: false }).split(/(?<=\.) /)) {
      expect(s).toMatch(/^[A-Z][a-z, ]+\.$/)
    }
  })

  it("is deterministic per seed, so regenerating only needs a new seed", () => {
    expect(generate({}, 42)).toBe(generate({}, 42))
    expect(generate({ classic: false }, 42)).not.toBe(generate({ classic: false }, 43))
  })

  it("clamps the count into a safe range", () => {
    expect(generate({ unit: "words", count: 0 }).split(" ")).toHaveLength(1)
    expect(generate({ unit: "paragraphs", count: 999 }).split("\n\n")).toHaveLength(50)
  })
})

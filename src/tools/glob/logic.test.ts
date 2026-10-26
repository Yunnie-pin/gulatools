import { describe, expect, it } from "vitest"
import { testGlobs } from "./logic"

const PATHS = "src/index.ts\nsrc/lib/util.ts\nsrc/lib/util.test.ts\nREADME.md\n.github/ci.yml\nsrc/.env"
const defaults = { dot: false, nocase: false }

describe("testGlobs", () => {
  it("matches across directories with ** but not with *", () => {
    expect(testGlobs("src/**/*.ts", PATHS, defaults).matched).toEqual([
      "src/index.ts",
      "src/lib/util.ts",
      "src/lib/util.test.ts",
    ])
    expect(testGlobs("src/*.ts", PATHS, defaults).matched).toEqual(["src/index.ts"])
  })

  it("subtracts ! patterns from the positive ones, like .gitignore and tool configs", () => {
    expect(testGlobs("src/**/*.ts\n!**/*.test.ts", PATHS, defaults).matched).toEqual([
      "src/index.ts",
      "src/lib/util.ts",
    ])
  })

  it("skips dotfiles unless dot is enabled", () => {
    expect(testGlobs("**/*", PATHS, defaults).unmatched).toEqual([".github/ci.yml", "src/.env"])
    expect(testGlobs("**/*", PATHS, { dot: true, nocase: false }).unmatched).toEqual([])
  })

  it("supports braces and case-insensitive matching", () => {
    expect(testGlobs("*.{md,MD}", PATHS, defaults).matched).toEqual(["README.md"])
    expect(testGlobs("readme.md", PATHS, { dot: false, nocase: true }).matched).toEqual(["README.md"])
  })

  it("exposes the compiled regex for each pattern", () => {
    const [pattern] = testGlobs("!*.md", "", defaults).patterns
    expect(pattern).toMatchObject({ pattern: "*.md", negated: true })
    expect(new RegExp(pattern?.regex ?? "").test("a.md")).toBe(true)
  })
})

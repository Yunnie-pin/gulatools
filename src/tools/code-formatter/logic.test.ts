import { describe, expect, it } from "vitest"
import { type CodeOptions, formatCode } from "./logic"

const options = (language: CodeOptions["language"], extra: Partial<CodeOptions> = {}): CodeOptions => ({
  language,
  tabWidth: 2,
  printWidth: 80,
  semi: true,
  singleQuote: false,
  ...extra,
})

describe("formatCode", () => {
  it("formats javascript", async () => {
    expect(await formatCode("const a={b:1}", options("javascript"))).toBe("const a = { b: 1 };\n")
  })

  it("honours semi and quote options", async () => {
    expect(await formatCode('let s = "x"', options("javascript", { semi: false, singleQuote: true }))).toBe(
      "let s = 'x'\n",
    )
  })

  it("formats typescript types", async () => {
    expect(await formatCode("type A={a:string}", options("typescript"))).toBe("type A = { a: string };\n")
  })

  it("formats css with 4-space indent", async () => {
    expect(await formatCode("a{color:red}", options("css", { tabWidth: 4 }))).toBe("a {\n    color: red;\n}\n")
  })

  it("formats html with inline script", async () => {
    const result = await formatCode("<div><script>let a=1</script></div>", options("html"))
    expect(result).toContain("let a = 1;")
  })

  it("reports syntax errors", async () => {
    await expect(formatCode("const = ;", options("javascript"))).rejects.toThrow()
  })
})

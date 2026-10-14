import { execFileSync } from "node:child_process"
import { describe, expect, it } from "vitest"
import { escapeText } from "./logic"

const TRICKY = `Gula "manis" & kopi's \\ pahit\n\tselesai`

describe("escapeText", () => {
  it("produces a JSON string body that parses back to the original", () => {
    const escaped = escapeText(TRICKY, "json")
    expect(escaped).toBe('Gula \\"manis\\" & kopi\'s \\\\ pahit\\n\\tselesai')
    expect(JSON.parse(`"${escaped}"`)).toBe(TRICKY)
  })

  it("unescapes JSON with or without surrounding quotes", () => {
    expect(escapeText("a\\nb \\u00e9", "jsonUnescape")).toBe("a\nb é")
    expect(escapeText('"a\\"b"', "jsonUnescape")).toBe('a"b')
    expect(() => escapeText("a\\x", "jsonUnescape")).toThrow()
  })

  it("makes regex metacharacters match literally", () => {
    const literal = "price: $5.00 (approx.) [a|b]*?"
    const escaped = escapeText(literal, "regex")
    expect(new RegExp(`^${escaped}$`).test(literal)).toBe(true)
    expect(new RegExp(escaped).test("price: $5x00 (approx.) [a|b]*?")).toBe(false)
  })

  it("quotes for POSIX shells so the text survives as one argument", () => {
    expect(escapeText("it's $HOME", "shell")).toBe("'it'\\''s $HOME'")
  })

  it.runIf(process.platform !== "win32")("round-trips through a real shell", () => {
    const quoted = escapeText(TRICKY, "shell")
    expect(execFileSync("sh", ["-c", `printf %s ${quoted}`], { encoding: "utf8" })).toBe(TRICKY)
  })

  it("doubles single quotes for SQL string literals", () => {
    expect(escapeText("O'Brien", "sql")).toBe("'O''Brien'")
  })
})

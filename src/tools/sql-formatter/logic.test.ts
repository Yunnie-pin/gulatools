import { describe, expect, it } from "vitest"
import { formatSql } from "./logic"

describe("formatSql", () => {
  it("formats and uppercases keywords", () => {
    expect(
      formatSql("select id, name from users where id = 1", { dialect: "sql", keywordCase: "upper", indent: 2 }),
    ).toBe(`SELECT
  id,
  name
FROM
  users
WHERE
  id = 1`)
  })

  it("respects indent width", () => {
    expect(formatSql("select a from b", { dialect: "postgresql", keywordCase: "preserve", indent: 4 })).toContain(
      "\n    a\n",
    )
  })

  it("throws on unparseable input", () => {
    expect(() => formatSql("select 'unterminated", { dialect: "sql", keywordCase: "upper", indent: 2 })).toThrow()
  })
})

import { describe, expect, it } from "vitest"
import { queryFromPath, searchTools } from "./search"

const ids = (query: string) => searchTools(query).map((tool) => tool.id)

describe("searchTools", () => {
  it("forgives typos so a mistyped tool URL still finds the tool", () => {
    expect(ids("jwtt")[0]).toBe("jwt")
    expect(ids("base 64")[0]).toBe("base64")
  })

  it("matches descriptions in every language, including Japanese", () => {
    expect(ids("パスワード")).toContain("password")
    expect(ids("kata sandi acak")).toContain("password")
  })
})

describe("queryFromPath", () => {
  it("turns the last URL segment into a search query", () => {
    expect(queryFromPath("/en/json-formater/")).toBe("json formater")
    expect(queryFromPath("/uuid.html")).toBe("uuid")
    expect(queryFromPath("/%E3%83%91%E3%82%B9")).toBe("パス")
    expect(queryFromPath("/")).toBe("")
  })

  it("keeps malformed escapes instead of crashing the 404 page", () => {
    expect(queryFromPath("/jwt%zz")).toBe("jwt%zz")
  })
})

import { describe, expect, it } from "vitest"
import { parseUrl, withParams } from "./logic"

describe("parseUrl", () => {
  const parsed = parseUrl("https://user:p%40ss@gula.id:8443/cari%20alat?q=gula+manis&tag=a&tag=b#hasil")
  const part = (label: string) => parsed.parts.find(([name]) => name === label)?.[1]

  it("splits a URL into decoded parts", () => {
    expect(part("Username")).toBe("user")
    expect(part("Password")).toBe("p@ss")
    expect(part("Hostname")).toBe("gula.id")
    expect(part("Port")).toBe("8443")
    expect(part("Path")).toBe("/cari alat")
    expect(part("Fragment")).toBe("#hasil")
  })

  it("decodes query params and keeps repeated keys in order", () => {
    expect(parsed.params).toEqual([
      ["q", "gula manis"],
      ["tag", "a"],
      ["tag", "b"],
    ])
  })

  it("rejects text that is not an absolute URL", () => {
    expect(() => parseUrl("gula.id/path")).toThrow("URL")
  })
})

describe("withParams", () => {
  it("rebuilds the query string with encoding while keeping the rest of the URL", () => {
    expect(withParams("https://gula.id/a?old=1#top", [["q", "a&b c"]])).toBe("https://gula.id/a?q=a%26b+c#top")
  })

  it("drops the question mark when no params remain", () => {
    expect(withParams("https://gula.id/a?x=1", [])).toBe("https://gula.id/a")
  })
})

describe("malformed escapes", () => {
  it("shows the raw text instead of crashing", () => {
    expect(parseUrl("https://gula.id/%zz").parts.find(([name]) => name === "Path")?.[1]).toBe("/%zz")
  })
})

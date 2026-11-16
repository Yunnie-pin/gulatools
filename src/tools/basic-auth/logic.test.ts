import { describe, expect, it } from "vitest"
import { basicAuth } from "./logic"

describe("basicAuth", () => {
  it("matches the RFC 7617 example, so servers accept the header", () => {
    expect(basicAuth("Aladdin", "open sesame").header).toBe("Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==")
  })

  it("encodes non-ASCII credentials as UTF-8, as RFC 7617 charset=UTF-8 expects", () => {
    expect(basicAuth("test", "123£").token).toBe("dGVzdDoxMjPCow==")
  })

  it("keeps colons in the password, since only the first colon splits the pair", () => {
    expect(atob(basicAuth("user", "a:b").token)).toBe("user:a:b")
  })

  it("rejects a colon in the username, which the server would split wrongly", () => {
    expect(() => basicAuth("us:er", "x")).toThrow("titik dua")
  })

  it("quotes the curl credentials so shell metacharacters stay literal", () => {
    expect(basicAuth("me", "it's $HOME").curl).toBe(`curl -u 'me:it'\\''s $HOME' https://example.com`)
  })
})

import { describe, expect, it } from "vitest"
import { hmac } from "./logic"

describe("hmac", () => {
  it("matches RFC 4231 test case 2", async () => {
    const { hex } = await hmac("what do ya want for nothing?", "Jefe", "SHA-256")
    expect(hex).toBe("5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843")
  })

  it("returns base64 of the same bytes", async () => {
    const { base64 } = await hmac("what do ya want for nothing?", "Jefe", "SHA-256")
    expect(base64).toBe("W9zBRr9gdU5qBCQmCJV1x1oAPwidJzmDnexYuWTsOEM=")
  })

  it("supports SHA-1", async () => {
    const { hex } = await hmac("The quick brown fox jumps over the lazy dog", "key", "SHA-1")
    expect(hex).toBe("de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9")
  })

  it("requires a key", async () => {
    await expect(hmac("pesan", "", "SHA-256")).rejects.toThrow("Kunci")
  })
})

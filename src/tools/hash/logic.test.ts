import { describe, expect, it } from "vitest"
import { hashFile, hashText } from "./logic"

describe("hashText", () => {
  it("matches known test vectors for 'abc'", async () => {
    const digests = await hashText("abc")
    expect(digests.md5).toBe("900150983cd24fb0d6963f7d28e17f72")
    expect(digests.sha1).toBe("a9993e364706816aba3e25717850c26c9cd0d89d")
    expect(digests.sha256).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
  })

  it("hashes empty input", async () => {
    expect((await hashText("")).md5).toBe("d41d8cd98f00b204e9800998ecf8427e")
  })
})

describe("hashFile", () => {
  it("gives the same digest as hashing the text directly", async () => {
    const text = "gula ".repeat(50_000)
    expect(await hashFile(new Blob([text]))).toEqual(await hashText(text))
  })
})

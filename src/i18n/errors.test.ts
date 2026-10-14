import { afterEach, describe, expect, it } from "vitest"
import { errorMessage } from "@/lib/result"
import { LocalizedError } from "./errors"
import { setLocale } from "./locale"

describe("LocalizedError", () => {
  afterEach(() => setLocale("id"))

  it("defaults to Indonesian and renders arguments", () => {
    const error = new LocalizedError("invalidXml", "Unclosed tag", 3)
    expect(error.message).toBe("XML tidak valid: Unclosed tag (baris 3)")
    expect(error.in("en")).toBe("Invalid XML: Unclosed tag (line 3)")
  })

  it("follows the active locale through errorMessage", () => {
    setLocale("en")
    expect(errorMessage(new LocalizedError("emptyKey"))).toBe("Key must not be empty")
    setLocale("id")
    expect(errorMessage(new LocalizedError("emptyKey"))).toBe("Kunci tidak boleh kosong")
  })

  it("passes plain errors through", () => {
    expect(errorMessage(new Error("boom"))).toBe("boom")
    expect(errorMessage("raw")).toBe("raw")
  })
})

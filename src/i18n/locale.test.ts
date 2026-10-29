import { describe, expect, it } from "vitest"
import { localeFromPath, localizePath, routerBasename } from "./locale"

describe("locale paths", () => {
  it("reads the locale from the /en prefix only, so tools starting with 'en' stay Indonesian", () => {
    expect(localeFromPath("/en")).toBe("en")
    expect(localeFromPath("/en/jwt")).toBe("en")
    expect(localeFromPath("/jwt")).toBe("id")
    expect(localeFromPath("/encoder")).toBe("id")
  })

  it("maps a page to its counterpart in the other language", () => {
    expect(localizePath("/jwt", "en")).toBe("/en/jwt")
    expect(localizePath("/en/jwt", "id")).toBe("/jwt")
    expect(localizePath("/", "en")).toBe("/en/")
    expect(localizePath("/en/", "id")).toBe("/")
    expect(localizePath("/en", "id")).toBe("/")
  })

  it("is idempotent, so switching to the current language keeps the URL", () => {
    expect(localizePath("/en/jwt", "en")).toBe("/en/jwt")
    expect(localizePath("/jwt", "id")).toBe("/jwt")
  })

  it("gives the router a basename only for English", () => {
    expect(routerBasename("en")).toBe("/en")
    expect(routerBasename("id")).toBeUndefined()
  })
})

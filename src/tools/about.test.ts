import { describe, expect, it } from "vitest"
import { LOCALES } from "@/i18n/locale"
import { about } from "./about"
import { tools } from "./registry"

describe("about", () => {
  it("covers every tool in every locale, so no tool page ships as thin content", () => {
    for (const tool of tools) {
      for (const locale of LOCALES) {
        const content = about[tool.id]?.[locale]
        expect(content?.intro, `${tool.id}/${locale}`).toBeTruthy()
        expect(content?.uses.length, `${tool.id}/${locale}`).toBeGreaterThan(0)
      }
    }
  })

  it("has no entries for tools that no longer exist", () => {
    const ids = new Set(tools.map((tool) => tool.id))
    expect(Object.keys(about).filter((id) => !ids.has(id))).toEqual([])
  })
})

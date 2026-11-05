import { describe, expect, it } from "vitest"
import { SHORTCUTS, shortcutLabel, shortcutTarget } from "./shortcuts"

describe("shortcuts", () => {
  it("formats keys the way Windows and Linux users read them", () => {
    expect(shortcutLabel("search")).toBe("Ctrl+K")
    expect(shortcutLabel("sample")).toBe("Alt+S")
    expect(shortcutLabel("run")).toBe("Ctrl+Enter")
    expect(shortcutLabel("help")).toBe("?")
  })

  it("gives every Alt shortcut a distinct physical key so two actions never fire together", () => {
    const codes = Object.values(SHORTCUTS).flatMap((shortcut) => ("code" in shortcut ? [shortcut.code] : []))
    expect(new Set(codes).size).toBe(codes.length)
  })

  it("marks a button for the global handler and shows the key in its tooltip", () => {
    expect(shortcutTarget("copy", "Salin")).toEqual({ "data-shortcut": "copy", title: "Salin (Alt+C)" })
  })
})

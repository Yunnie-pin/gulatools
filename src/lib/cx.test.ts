import { describe, expect, it } from "vitest"
import { cx } from "./cx"

describe("cx", () => {
  it("lets later width classes win", () => {
    expect(cx("h-10 w-full", "w-28")).toBe("h-10 w-28")
  })

  it("keeps theme text color and font size apart", () => {
    expect(cx("text-sm text-ink", "text-ink-soft")).toBe("text-sm text-ink-soft")
  })

  it("merges theme radii", () => {
    expect(cx("rounded-glass-sm", "rounded-glass")).toBe("rounded-glass")
  })

  it("drops falsy values", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b")
  })
})

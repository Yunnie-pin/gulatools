import { describe, expect, it } from "vitest"
import { generateIds, MAX_COUNT } from "./logic"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-([47])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe("generateIds", () => {
  it("creates valid v4 uuids", () => {
    for (const id of generateIds({ kind: "uuid-v4", count: 20, uppercase: false })) {
      expect(id).toMatch(UUID)
      expect(id[14]).toBe("4")
    }
  })

  it("creates time-ordered v7 uuids", () => {
    const ids = generateIds({ kind: "uuid-v7", count: 50, uppercase: false })
    expect(ids.every((id) => UUID.test(id) && id[14] === "7")).toBe(true)
    expect([...ids].sort()).toEqual(ids)
  })

  it("creates 26-character uppercase ulids", () => {
    const [id] = generateIds({ kind: "ulid", count: 1, uppercase: true })
    expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/)
  })

  it("never repeats", () => {
    const ids = generateIds({ kind: "uuid-v4", count: 500, uppercase: false })
    expect(new Set(ids).size).toBe(500)
  })

  it("clamps the count", () => {
    expect(generateIds({ kind: "ulid", count: 0, uppercase: false })).toHaveLength(1)
    expect(generateIds({ kind: "ulid", count: 99_999, uppercase: false })).toHaveLength(MAX_COUNT)
  })
})

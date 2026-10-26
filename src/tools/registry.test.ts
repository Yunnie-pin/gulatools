import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { tools } from "./registry"

describe("registry", () => {
  it("keeps each tool in a folder named after its id, so the GitHub source link resolves", () => {
    const missing = tools.filter((tool) => !existsSync(join(import.meta.dirname, tool.id, "index.ts")))
    expect(missing.map((tool) => tool.id)).toEqual([])
  })
})

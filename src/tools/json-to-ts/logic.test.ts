import { describe, expect, it } from "vitest"
import { toTypeScript, toZod } from "./logic"

const sample = {
  id: 1,
  name: "Gula",
  tags: ["a", "b"],
  profile: { bio: null, "avatar-url": "x" },
  users: [{ id: 1, email: "a@b.c" }, { id: 2 }],
}

describe("toTypeScript", () => {
  it("emits the root interface first with nested interfaces after", () => {
    expect(toTypeScript(sample)).toBe(`export interface Root {
  id: number
  name: string
  tags: string[]
  profile: Profile
  users: User[]
}

export interface Profile {
  bio: null
  "avatar-url": string
}

export interface User {
  id: number
  email?: string
}
`)
  })

  it("unions mixed values and wraps union arrays", () => {
    expect(toTypeScript({ values: [1, "x", null] })).toContain("values: (number | string | null)[]")
  })

  it("handles a root array", () => {
    expect(toTypeScript([{ a: 1 }], "Rows")).toBe(
      "export type Rows = Row[]\n\nexport interface Row {\n  a: number\n}\n",
    )
  })

  it("avoids duplicate interface names", () => {
    const ts = toTypeScript({ a: { item: { x: 1 } }, b: { item: { y: 1 } } })
    expect(ts).toContain("export interface Item {")
    expect(ts).toContain("export interface Item2 {")
  })

  it("types empty arrays as unknown", () => {
    expect(toTypeScript({ list: [] })).toContain("list: unknown[]")
  })
})

describe("toZod", () => {
  it("builds a nested schema with optional and nullable fields", () => {
    expect(toZod({ users: [{ id: 1, nick: "a" }, { id: 2, nick: null }, { id: 3 }] }, "payload")).toBe(
      `import { z } from "zod"

export const payloadSchema = z.object({
  users: z.array(z.object({
    id: z.number(),
    nick: z.string().nullable().optional(),
  })),
})

export type Payload = z.infer<typeof payloadSchema>
`,
    )
  })
})

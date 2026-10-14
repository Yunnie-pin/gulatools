import { describe, expect, it } from "vitest"
import { validateJson } from "./logic"

const schema = (extra: object = {}) =>
  JSON.stringify({
    type: "object",
    required: ["name", "email"],
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      age: { type: "integer", minimum: 0 },
    },
    additionalProperties: false,
    ...extra,
  })

describe("validateJson", () => {
  it("accepts data that matches the schema", () => {
    expect(validateJson(schema(), '{"name":"Gula","email":"gula@example.com"}')).toEqual({
      draft: "draft-07",
      issues: [],
    })
  })

  it("reports every problem at once with its location", () => {
    const { issues } = validateJson(schema(), '{"name":"","email":"bukan-email","age":-1,"extra":true}')
    expect(issues).toEqual(
      expect.arrayContaining([
        { path: "/name", message: "must NOT have fewer than 1 characters" },
        { path: "/email", message: 'must match format "email"' },
        { path: "/age", message: "must be >= 0" },
        { path: "/", message: "must NOT have additional properties: extra" },
      ]),
    )
    expect(issues).toHaveLength(4)
  })

  it("picks the draft from $schema so draft-specific keywords behave correctly", () => {
    const tuple2020 = JSON.stringify({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      prefixItems: [{ type: "number" }],
      items: false,
    })
    expect(validateJson(tuple2020, "[1]")).toEqual({ draft: "2020-12", issues: [] })
    expect(validateJson(tuple2020, "[1, 2]").issues).toHaveLength(1)
    expect(validateJson(JSON.stringify({ $schema: "https://json-schema.org/draft/2019-09/schema" }), "1").draft).toBe(
      "2019-09",
    )
  })

  it("tolerates unknown keywords instead of refusing the schema", () => {
    expect(validateJson(schema({ "x-internal": true }), '{"name":"a","email":"a@b.co"}').issues).toEqual([])
  })

  it("says which side has broken JSON or an invalid schema", () => {
    expect(() => validateJson("{", "{}")).toThrow("Schema bukan JSON")
    expect(() => validateJson("{}", "{")).toThrow("Data bukan JSON")
    expect(() => validateJson('{"type":"nope"}', "{}")).toThrow("Schema tidak valid")
  })
})

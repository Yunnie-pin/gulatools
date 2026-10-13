import { describe, expect, it } from "vitest"
import { convert } from "./logic"

const users = '[{"id":1,"name":"Gula"},{"id":2,"name":"Manis"}]'

describe("convert", () => {
  it("json → yaml → json round-trips", () => {
    const json = '{\n  "a": {\n    "b": [\n      1,\n      true,\n      null\n    ]\n  }\n}'
    expect(convert(convert(json, "json", "yaml"), "yaml", "json")).toBe(json)
  })

  it("json → csv", () => {
    expect(convert(users, "json", "csv")).toBe("id,name\r\n1,Gula\r\n2,Manis")
  })

  it("csv → json keeps numbers typed", () => {
    expect(JSON.parse(convert("id,name\n1,Gula\n2,Manis\n", "csv", "json"))).toEqual(JSON.parse(users))
  })

  it("csv stringifies nested values", () => {
    expect(convert('[{"tags":["a","b"]}]', "json", "csv")).toBe('tags\r\n"[""a"",""b""]"')
  })

  it("json → toml", () => {
    expect(convert('{"title":"gula","db":{"port":5432}}', "json", "toml")).toBe('title = "gula"\n\n[db]\nport = 5432\n')
  })

  it("toml needs an object", () => {
    expect(() => convert(users, "json", "toml")).toThrow("objek")
  })

  it("xml keeps attributes", () => {
    const value = JSON.parse(convert('<user id="7"><name>Gula</name></user>', "xml", "json"))
    expect(value).toEqual({ user: { name: "Gula", "@_id": 7 } })
  })

  it("json → xml wraps arrays", () => {
    expect(convert(users, "json", "xml")).toContain("<root>\n  <item>\n    <id>1</id>")
  })

  it("reports invalid xml with a line number", () => {
    expect(() => convert("<a>\n<b></a>", "xml", "json")).toThrow(/XML tidak valid.*baris/)
  })
})

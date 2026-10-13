import { describe, expect, it } from "vitest"
import { queryJson } from "./logic"

const store = JSON.stringify({
  store: {
    book: [
      { title: "A", price: 10 },
      { title: "B", price: 25 },
    ],
  },
})

const query = (path: string) => JSON.parse(queryJson(store, path)) as unknown

describe("queryJson", () => {
  it("selects with wildcards", () => {
    expect(query("$.store.book[*].title")).toEqual(["A", "B"])
  })

  it("supports recursive descent", () => {
    expect(query("$..price")).toEqual([10, 25])
  })

  it("supports filters", () => {
    expect(query("$.store.book[?(@.price > 20)].title")).toEqual(["B"])
  })

  it("returns an empty array when nothing matches", () => {
    expect(query("$.nope")).toEqual([])
  })

  it("requires a path starting with $", () => {
    expect(() => queryJson(store, "store")).toThrow("$")
  })
})

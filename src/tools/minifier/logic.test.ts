import { describe, expect, it } from "vitest"
import { minify } from "./logic"

describe("minify", () => {
  it("compresses JavaScript, mangling locals but keeping exports intact", async () => {
    const output = await minify(
      "// helper\nexport function greet(name) {\n  const message = 'Hello, ' + name\n  return message\n}\n",
      "js",
    )
    expect(output).toBe('export function greet(e){return"Hello, "+e}')
  })

  it("minifies CSS and merges duplicate rules", async () => {
    expect(await minify(".a { color: #ff0000; margin: 0px }\n.a { padding: 0 }", "css")).toBe(
      ".a{color:red;margin:0;padding:0}",
    )
  })

  it("reports JavaScript syntax errors with their position", async () => {
    await expect(minify("const = 1", "js")).rejects.toThrow(/Gagal minify: .*\(1:\d+\)/)
  })
})

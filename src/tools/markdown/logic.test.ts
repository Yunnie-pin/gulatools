import { describe, expect, it } from "vitest"
import { markdownToHtml } from "./logic"

describe("markdownToHtml", () => {
  it("renders headings, emphasis and links", () => {
    expect(markdownToHtml("# Gula\n\n**manis** [kopi](https://example.com)")).toBe(
      '<h1>Gula</h1>\n<p><strong>manis</strong> <a href="https://example.com">kopi</a></p>\n',
    )
  })

  it("supports GitHub-flavored tables, task lists and strikethrough", () => {
    const html = markdownToHtml("| a | b |\n| - | - |\n| 1 | 2 |\n\n- [x] selesai\n\n~~lama~~")
    expect(html).toContain("<table>")
    expect(html).toContain('<input checked="" disabled="" type="checkbox">')
    expect(html).toContain("<del>lama</del>")
  })

  it("keeps fenced code language hints for highlighting", () => {
    expect(markdownToHtml("```ts\nconst a = 1\n```")).toContain('<code class="language-ts">')
  })

  it("passes raw HTML through, which is why the preview must sanitize it", () => {
    expect(markdownToHtml('<img src=x onerror="alert(1)">')).toContain("onerror")
  })
})

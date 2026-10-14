import AxeBuilder from "@axe-core/playwright"
import { test as base, expect, type Page } from "@playwright/test"

type Guard = { errors: string[]; external: string[] }

export const test = base.extend<{ guard: Guard }>({
  guard: [
    async ({ page, baseURL }, use) => {
      const guard: Guard = { errors: [], external: [] }
      page.on("pageerror", (error) => guard.errors.push(error.message))
      page.on("console", (message) => {
        if (message.type() === "error") guard.errors.push(message.text())
      })
      page.on("request", (request) => {
        const url = request.url()
        if (!url.startsWith(baseURL ?? "") && !url.startsWith("blob:") && !url.startsWith("data:")) {
          guard.external.push(url)
        }
      })
      await use(guard)
      expect(guard.errors, "console/page errors").toEqual([])
      expect(guard.external, "requests leaving the origin").toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

export async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
  const summary = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
  expect(summary).toEqual([])
}

export const editorOutput = (page: Page) => page.locator(".cm-content").nth(1)

export async function openWithSample(page: Page, path: string) {
  await page.goto(path)
  await page.getByRole("button", { name: "Contoh" }).click()
}

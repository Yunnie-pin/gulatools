import { editorOutput, expect, expectAccessible, test } from "./fixtures"

test("deep link options preselect the tool and leave a clean URL", async ({ page }) => {
  await page.goto("/base64?mode=decode&encoding=hex")
  await expect(page.getByRole("radio", { name: "Decode" })).toBeChecked()
  await expect(page.getByRole("radio", { name: "Hex" })).toBeChecked()
  expect(new URL(page.url()).search).toBe("")
  await page.getByRole("button", { name: "Contoh" }).click()
  await expect(editorOutput(page)).toHaveText("Gula itu manis — ünïcödé")
})

test("keyboard shortcuts drive the common actions, even from inside the editor", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.clipboard.writeText = async (text: string) => {
      document.documentElement.dataset.copied = text
    }
  })
  await page.goto("/base64")
  await page.locator(".cm-content").first().click()
  await page.keyboard.press("Alt+KeyS")
  await expect(editorOutput(page)).toHaveText("R3VsYSBpdHUgbWFuaXMg4oCUIMO8bsOvY8O2ZMOp")
  await page.keyboard.press("Alt+KeyC")
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.copied))
    .toBe("R3VsYSBpdHUgbWFuaXMg4oCUIMO8bsOvY8O2ZMOp")
  await page.keyboard.press("Alt+KeyX")
  await expect(page.locator(".cm-placeholder").first()).toBeVisible()

  const favorite = page.getByRole("button", { name: /favorit/ })
  await page.keyboard.press("Alt+KeyF")
  await expect(favorite).toHaveAttribute("aria-pressed", "true")

  await page.goto("/uuid")
  const output = page.locator(".cm-content").first()
  await expect(output).not.toHaveText("")
  const first = await output.textContent()
  await page.locator("main h1").click()
  await page.keyboard.press("Control+Enter")
  await expect(output).not.toHaveText(first ?? "")

  await page.locator("main h1").click()
  await page.keyboard.press("Shift+Slash")
  const dialog = page.getByRole("dialog", { name: "Pengaturan" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText("Alt+S")).toBeVisible()
  await expectAccessible(page)
})

test("editor settings apply to every editor and persist", async ({ page }) => {
  await page.goto("/json-formatter")
  await page.locator("main h1").click()
  await page.keyboard.press("Shift+Slash")
  const dialog = page.getByRole("dialog", { name: "Pengaturan" })
  await dialog.getByText("16px", { exact: true }).click()
  await dialog.getByLabel("Nomor baris").uncheck()
  await page.keyboard.press("Escape")

  const editor = page.locator(".cm-editor").first()
  await expect(editor).toHaveCSS("font-size", "16px")
  await expect(page.locator(".cm-lineNumbers")).toHaveCount(0)

  await page.goto("/json-diff")
  await expect(page.locator(".cm-editor").first()).toHaveCSS("font-size", "16px")
  await expect(page.locator(".cm-lineNumbers")).toHaveCount(0)
})

test("the app reports going offline and offers installation when the browser allows it", async ({ page, context }) => {
  await page.goto("/")
  await page.evaluate(() => navigator.serviceWorker.ready)
  await context.setOffline(true)
  await expect(page.getByText("Kamu sedang offline. Semua tool tetap berjalan.")).toBeVisible()
  await context.setOffline(false)
  await expect(page.getByText("Kembali online")).toBeVisible()

  await page.evaluate(() => {
    const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt: async () => {},
      userChoice: Promise.resolve({ outcome: "accepted" }),
    })
    window.dispatchEvent(event)
  })
  const install = page.getByRole("button", { name: "Install GulaTools" }).first()
  await expect(install).toBeVisible()
  await install.click()
  await expect(page.getByRole("button", { name: "Install GulaTools" })).toHaveCount(0)
})

test("a page loaded right after an automatic update says so once", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => sessionStorage.setItem("gulatools:updated", "1"))
  await page.reload()
  await expect(page.getByText("GulaTools diperbarui ke versi terbaru")).toBeVisible()
  await page.reload()
  await expect(page.getByText("GulaTools diperbarui ke versi terbaru")).toHaveCount(0)
})

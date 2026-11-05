import { useEffect } from "react"

export const IS_MAC = /Mac|iPhone|iPad/.test(globalThis.navigator?.userAgent ?? "")

type Shortcut = { mod?: boolean; alt?: boolean; key: string; code?: string }

export const SHORTCUTS = {
  search: { mod: true, key: "K" },
  help: { key: "?" },
  sample: { alt: true, key: "S", code: "KeyS" },
  clear: { alt: true, key: "X", code: "KeyX" },
  copy: { alt: true, key: "C", code: "KeyC" },
  run: { mod: true, key: "Enter" },
  share: { alt: true, key: "L", code: "KeyL" },
  favorite: { alt: true, key: "F", code: "KeyF" },
} as const satisfies Record<string, Shortcut>

export type ShortcutId = keyof typeof SHORTCUTS

export function shortcutLabel(id: ShortcutId): string {
  const shortcut: Shortcut = SHORTCUTS[id]
  const key = shortcut.key === "Enter" && IS_MAC ? "↩" : shortcut.key
  if (IS_MAC) return `${shortcut.mod ? "⌘" : ""}${shortcut.alt ? "⌥" : ""}${key}`
  return [shortcut.mod && "Ctrl", shortcut.alt && "Alt", key].filter(Boolean).join("+")
}

/** Spread onto a button so the global handler can trigger it, and show the key in its tooltip. */
export const shortcutTarget = (id: ShortcutId, label: string) => ({
  "data-shortcut": id,
  title: `${label} (${shortcutLabel(id)})`,
})

const ALT_TARGETS = Object.fromEntries(
  Object.entries(SHORTCUTS).flatMap(([id, shortcut]: [string, Shortcut]) =>
    shortcut.alt && shortcut.code ? [[shortcut.code, id]] : [],
  ),
)

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))

function clickTarget(id: string) {
  const target = document.querySelector<HTMLButtonElement | HTMLAnchorElement>(`main [data-shortcut="${id}"]`)
  if (!target || (target instanceof HTMLButtonElement && target.disabled)) return false
  target.click()
  return true
}

/** Captures before CodeMirror so Alt shortcuts work inside editors, but only when the page has a matching control. */
export function useGlobalShortcuts(onHelp: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = IS_MAC ? event.metaKey : event.ctrlKey
      let handled = false
      if (event.key === "?" && !mod && !event.altKey && !isEditable(event.target)) {
        onHelp()
        handled = true
      } else if (mod && !event.altKey && event.key === "Enter") {
        const form = document.activeElement instanceof HTMLElement ? document.activeElement.closest("form") : null
        if (form) {
          form.requestSubmit()
          handled = true
        } else handled = clickTarget("run")
      } else if (event.altKey && !mod && !event.shiftKey && ALT_TARGETS[event.code]) {
        handled = clickTarget(ALT_TARGETS[event.code] as string)
      }
      if (handled) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener("keydown", onKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true })
  }, [onHelp])
}

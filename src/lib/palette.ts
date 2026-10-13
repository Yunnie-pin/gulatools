const OPEN_EVENT = "gulatools:open-palette"

export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT))

export function onOpenPalette(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler)
  return () => window.removeEventListener(OPEN_EVENT, handler)
}

export const PALETTE_SHORTCUT = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"

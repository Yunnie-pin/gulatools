import { useSyncExternalStore } from "react"

const STORAGE_KEY = "gulatools:sidebar-pinned"
const WIDE_SCREEN = "(min-width: 1536px)"

const listeners = new Set<() => void>()

function readPinned(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === "1"
  } catch {}
  return window.matchMedia(WIDE_SCREEN).matches
}

let pinned = readPinned()

export function setSidebarPinned(next: boolean) {
  pinned = next
  try {
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
  } catch {}
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useSidebarPinned = () => useSyncExternalStore(subscribe, () => pinned)

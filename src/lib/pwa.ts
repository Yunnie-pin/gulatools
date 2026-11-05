import { useSyncExternalStore } from "react"

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const UPDATED_KEY = "gulatools:updated"

let installPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
const emit = () => {
  for (const listener of listeners) listener()
}
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const isStandalone = () => globalThis.matchMedia?.("(display-mode: standalone)").matches ?? false

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault()
    installPrompt = event as BeforeInstallPromptEvent
    emit()
  })
  window.addEventListener("appinstalled", () => {
    installPrompt = null
    emit()
  })
  window.addEventListener("online", emit)
  window.addEventListener("offline", emit)
}

export const useCanInstall = () => useSyncExternalStore(subscribe, () => installPrompt !== null)

export const useInstalled = () => useSyncExternalStore(subscribe, isStandalone)

export const useOnline = () => useSyncExternalStore(subscribe, () => navigator.onLine)

export async function promptInstall() {
  const prompt = installPrompt
  if (!prompt) return
  await prompt.prompt()
  await prompt.userChoice
  installPrompt = null
  emit()
}

/** Remembers across the automatic reload that a new version was activated, so the next page load can say so. */
export function markUpdated() {
  try {
    sessionStorage.setItem(UPDATED_KEY, "1")
  } catch {}
}

export function consumeUpdated() {
  try {
    const updated = sessionStorage.getItem(UPDATED_KEY) === "1"
    sessionStorage.removeItem(UPDATED_KEY)
    return updated
  } catch {
    return false
  }
}

import { useSyncExternalStore } from "react"

export type Toast = {
  id: number
  message: string
  tone: "info" | "error"
}

const DURATION_MS = 2200

let toasts: Toast[] = []
let nextId = 0
const listeners = new Set<() => void>()

const emit = () => {
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function toast(message: string, tone: Toast["tone"] = "info") {
  const id = nextId++
  toasts = [...toasts, { id, message, tone }]
  emit()
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  }, DURATION_MS)
}

export const useToasts = () => useSyncExternalStore(subscribe, () => toasts)

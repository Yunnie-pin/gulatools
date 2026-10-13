import { useSyncExternalStore } from "react"

export function createPersistentStore<T>(key: string, initial: () => T, parse: (raw: unknown) => T | undefined) {
  const listeners = new Set<() => void>()

  const load = (): T => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return parse(JSON.parse(raw)) ?? initial()
    } catch {}
    return initial()
  }

  let value = load()

  const set = (next: T) => {
    value = next
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {}
    for (const listener of listeners) listener()
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return {
    get: () => value,
    set,
    update: (fn: (current: T) => T) => set(fn(value)),
    use: () => useSyncExternalStore(subscribe, () => value),
  }
}

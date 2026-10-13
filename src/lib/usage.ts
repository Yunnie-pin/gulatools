import { createPersistentStore } from "./store"

export const RECENT_LIMIT = 8

export type RecentEntry = {
  id: string
  at: number
}

type Usage = {
  favorites: string[]
  recent: RecentEntry[]
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string")

const isRecentArray = (value: unknown): value is RecentEntry[] =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).id === "string" &&
      typeof (item as Record<string, unknown>).at === "number",
  )

const usage = createPersistentStore<Usage>(
  "gulatools:usage",
  () => ({ favorites: [], recent: [] }),
  (raw) => {
    if (typeof raw !== "object" || raw === null) return undefined
    const { favorites, recent } = raw as Record<string, unknown>
    return {
      favorites: isStringArray(favorites) ? favorites : [],
      recent: isRecentArray(recent) ? recent : [],
    }
  },
)

export const useUsage = usage.use

export function recordVisit(id: string) {
  usage.update((current) => ({
    ...current,
    recent: [{ id, at: Date.now() }, ...current.recent.filter((entry) => entry.id !== id)].slice(0, RECENT_LIMIT),
  }))
}

export const clearRecent = () => usage.update((current) => ({ ...current, recent: [] }))

export function toggleFavorite(id: string) {
  usage.update((current) => ({
    ...current,
    favorites: current.favorites.includes(id)
      ? current.favorites.filter((item) => item !== id)
      : [...current.favorites, id],
  }))
}

export const BACKGROUND_IDS = ["1", "2", "3", "4"] as const

export type BackgroundId = (typeof BACKGROUND_IDS)[number]

export const isBackgroundId = (value: unknown): value is BackgroundId => BACKGROUND_IDS.some((id) => id === value)

export const backgroundUrl = (id: BackgroundId) => `/background/${id}.webp`

export const backgroundSrcSet = (id: BackgroundId) => `/background/${id}-sm.webp 828w, /background/${id}.webp 1920w`

export const backgroundThumbUrl = (id: BackgroundId) => `/background/thumb/${id}.webp`

export const BACKGROUND_FOCUS: Record<BackgroundId, string> = {
  "1": "57% 34%",
  "2": "72% 42%",
  "3": "51% 51%",
  "4": "56% 58%",
}

export const BACKGROUND_IDS = ["1", "2", "3", "4"] as const

export type BackgroundId = (typeof BACKGROUND_IDS)[number]

export const isBackgroundId = (value: unknown): value is BackgroundId => BACKGROUND_IDS.some((id) => id === value)

export const backgroundUrl = (id: BackgroundId) => `/background/${id}.webp`

export const backgroundThumbUrl = (id: BackgroundId) => `/background/thumb/${id}.webp`

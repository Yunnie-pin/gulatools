import { isRecord } from "./guards"
import { createPersistentStore } from "./store"

export const FONT_SIZES = [12, 13, 14, 16] as const

export type EditorSettings = {
  fontSize: (typeof FONT_SIZES)[number]
  wrap: boolean
  lineNumbers: boolean
}

const DEFAULTS: EditorSettings = { fontSize: 13, wrap: true, lineNumbers: true }

const parse = (raw: unknown): EditorSettings | undefined => {
  if (!isRecord(raw)) return undefined
  return {
    fontSize: FONT_SIZES.find((size) => size === raw.fontSize) ?? DEFAULTS.fontSize,
    wrap: typeof raw.wrap === "boolean" ? raw.wrap : DEFAULTS.wrap,
    lineNumbers: typeof raw.lineNumbers === "boolean" ? raw.lineNumbers : DEFAULTS.lineNumbers,
  }
}

const store = createPersistentStore<EditorSettings>("gulatools:editor", () => DEFAULTS, parse)

export const useEditorSettings = store.use

export const updateEditorSettings = (patch: Partial<EditorSettings>) =>
  store.update((current) => ({ ...current, ...patch }))

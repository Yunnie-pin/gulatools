import { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useState } from "react"
import { isRecord } from "./guards"

// I have nothing but my burger and I want nothing more
const PREFIX = "gulatools:tool:"

const ToolStateContext = createContext<string | null>(null)

/** Memberi namespace localStorage per tool; dipasang oleh ToolPage. */
export const ToolStateProvider = ToolStateContext.Provider

export const oneOf = (values: readonly unknown[]) => (value: unknown) => values.includes(value)

export const inRange = (min: number, max: number) => (value: unknown) =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max

export const isOption = (options: readonly { value: unknown }[]) => oneOf(options.map((option) => option.value))

/** Ambil `raw` hanya bila bentuknya sama dengan `initial`; field yang hilang/salah tipe jatuh ke nilai awal. */
function matchShape<T>(initial: T, raw: unknown): T {
  if (isRecord(initial)) {
    if (!isRecord(raw)) return initial
    const merged: Record<string, unknown> = {}
    for (const key of Object.keys(initial)) merged[key] = matchShape(initial[key], raw[key])
    return merged as T
  }
  if (typeof raw !== typeof initial || Array.isArray(raw) !== Array.isArray(initial) || raw === null) return initial
  return raw as T
}

function load<T>(key: string, initial: T, isValid?: (value: T) => boolean): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return initial
    const parsed: unknown = JSON.parse(raw)
    if (!isValid) return matchShape(initial, parsed)
    // Validator menentukan untuk union campuran (mis. 2 | "\t"); objek tetap dilengkapi dulu ke bentuk awalnya.
    const value = (isRecord(initial) ? matchShape(initial, parsed) : parsed) as T
    return isValid(value) ? value : initial
  } catch {
    return initial
  }
}

/**
 * Seperti useState, tapi nilainya bertahan di localStorage sehingga tetap ada setelah pindah route atau tab ditutup.
 * Jangan dipakai untuk secret (password, key, token).
 */
export function usePersistentState<T>(
  name: string,
  initial: T | (() => T),
  isValid?: (value: T) => boolean,
): [T, Dispatch<SetStateAction<T>>] {
  const toolId = useContext(ToolStateContext)
  const key = toolId && `${PREFIX}${toolId}:${name}`
  const [value, setValue] = useState(() => {
    const start = initial instanceof Function ? initial() : initial
    return key ? load(key, start, isValid) : start
  })

  useEffect(() => {
    if (!key) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Kuota penuh: buang nilai lama supaya yang dipulihkan nanti tidak basi.
      try {
        localStorage.removeItem(key)
      } catch {}
    }
  }, [key, value])

  return [value, setValue]
}

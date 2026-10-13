import { createContext, type ReactNode, use, useEffect, useState, useSyncExternalStore } from "react"
import { type BackgroundId, isBackgroundId } from "./backgrounds"

export type Mode = "light" | "dark" | "system"

export type ResolvedMode = Exclude<Mode, "system">

type Theme = {
  mode: Mode
  resolved: ResolvedMode
  background: BackgroundId
  setMode: (mode: Mode) => void
  setBackground: (background: BackgroundId) => void
}

type SavedTheme = Pick<Theme, "mode" | "background">

const STORAGE_KEY = "gulatools:theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

const ThemeContext = createContext<Theme | null>(null)

const isMode = (value: unknown): value is Mode => value === "light" || value === "dark" || value === "system"

function loadSaved(): SavedTheme {
  const fallback: SavedTheme = { mode: "system", background: "1" }
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")
    if (typeof saved !== "object" || saved === null) return fallback
    const { mode, background } = saved as Record<string, unknown>
    return {
      mode: isMode(mode) ? mode : fallback.mode,
      background: isBackgroundId(background) ? background : fallback.background,
    }
  } catch {
    return fallback
  }
}

function subscribeToSystem(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(loadSaved)
  const systemDark = useSyncExternalStore(subscribeToSystem, systemPrefersDark)
  const resolved: ResolvedMode = theme.mode === "system" ? (systemDark ? "dark" : "light") : theme.mode

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
    } catch {}
  }, [theme])

  const value: Theme = {
    ...theme,
    resolved,
    setMode: (mode) => setTheme((t) => ({ ...t, mode })),
    setBackground: (background) => setTheme((t) => ({ ...t, background })),
  }

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): Theme {
  const theme = use(ThemeContext)
  if (!theme) throw new Error("useTheme must be used inside <ThemeProvider>")
  return theme
}

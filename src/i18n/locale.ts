import { useSyncExternalStore } from "react"

export const LOCALES = ["id", "en", "ja"] as const

export type Locale = (typeof LOCALES)[number]

export type Localized = Record<Locale, string>

export type Text = string | Localized

export const LOCALE_NAMES: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English", ja: "日本語" }

export const DEFAULT_LOCALE: Locale = "id"

const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

const PREFIX = new RegExp(`^/(${PREFIXED.join("|")})(?=/|$)`)

const isLocale = (value: string | undefined): value is Locale => LOCALES.some((locale) => locale === value)

export function localeFromPath(pathname: string): Locale {
  const prefix = PREFIX.exec(pathname)?.[1]
  return isLocale(prefix) ? prefix : DEFAULT_LOCALE
}

export const routerBasename = (locale: Locale) => (locale === DEFAULT_LOCALE ? undefined : `/${locale}`)

export function localizePath(pathname: string, locale: Locale): string {
  const path = pathname.replace(PREFIX, "") || "/"
  if (locale === DEFAULT_LOCALE) return path
  return path === "/" ? `/${locale}/` : `/${locale}${path}`
}

export function browserLocale(): Locale {
  const language = globalThis.navigator?.language?.toLowerCase().slice(0, 2)
  return language === "id" || language === "ja" ? language : "en"
}

let current: Locale = typeof location === "undefined" ? DEFAULT_LOCALE : localeFromPath(location.pathname)
const listeners = new Set<() => void>()

const applyLang = (locale: Locale) => {
  if (typeof document !== "undefined") document.documentElement.lang = locale
}

applyLang(current)

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getLocale = () => current

export const useLocale = () => useSyncExternalStore(subscribe, getLocale)

export function setLocale(locale: Locale) {
  current = locale
  applyLang(locale)
  for (const listener of listeners) listener()
}

export function switchLocale(locale: Locale) {
  const { pathname, search, hash } = window.location
  window.location.assign(`${localizePath(pathname, locale)}${search}${hash}`)
}

export const localize = (text: Text, locale: Locale) => (typeof text === "string" ? text : text[locale])

export function useLocalize() {
  const locale = useLocale()
  return (text: Text) => localize(text, locale)
}

export function defineMessages<T>(id: T, en: NoInfer<T>, ja: NoInfer<T>): Record<Locale, T> {
  return { id, en, ja }
}

export function useMessages<T>(messages: Record<Locale, T>): T {
  return messages[useLocale()]
}

export const currentMessages = <T>(messages: Record<Locale, T>): T => messages[getLocale()]

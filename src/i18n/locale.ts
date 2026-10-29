import { useSyncExternalStore } from "react"

export const LOCALES = ["id", "en"] as const

export type Locale = (typeof LOCALES)[number]

export type Localized = Record<Locale, string>

export type Text = string | Localized

export const LOCALE_NAMES: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English" }

export const DEFAULT_LOCALE: Locale = "id"

const EN_PREFIX = /^\/en(?=\/|$)/

export const localeFromPath = (pathname: string): Locale => (EN_PREFIX.test(pathname) ? "en" : DEFAULT_LOCALE)

export const routerBasename = (locale: Locale) => (locale === "en" ? "/en" : undefined)

export function localizePath(pathname: string, locale: Locale): string {
  const path = pathname.replace(EN_PREFIX, "") || "/"
  if (locale === DEFAULT_LOCALE) return path
  return path === "/" ? "/en/" : `/en${path}`
}

export const browserLocale = (): Locale =>
  globalThis.navigator?.language?.toLowerCase().startsWith("id") ? "id" : "en"

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

export function defineMessages<T>(id: T, en: NoInfer<T>): Record<Locale, T> {
  return { id, en }
}

export function useMessages<T>(messages: Record<Locale, T>): T {
  return messages[useLocale()]
}

export const currentMessages = <T>(messages: Record<Locale, T>): T => messages[getLocale()]

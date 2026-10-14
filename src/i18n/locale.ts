import { createPersistentStore } from "@/lib/store"

export const LOCALES = ["id", "en"] as const

export type Locale = (typeof LOCALES)[number]

export type Localized = Record<Locale, string>

export type Text = string | Localized

export const LOCALE_NAMES: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English" }

const isLocale = (value: unknown): value is Locale => LOCALES.some((locale) => locale === value)

const detect = (): Locale => (globalThis.navigator?.language?.toLowerCase().startsWith("id") ? "id" : "en")

const store = createPersistentStore<Locale>("gulatools:locale", detect, (raw) => (isLocale(raw) ? raw : undefined))

const applyLang = (locale: Locale) => {
  if (typeof document !== "undefined") document.documentElement.lang = locale
}

applyLang(store.get())

export const useLocale = store.use

export const getLocale = store.get

export function setLocale(locale: Locale) {
  store.set(locale)
  applyLang(locale)
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

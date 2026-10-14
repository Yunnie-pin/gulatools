import { useEffect } from "react"
import { type Locale, localize, type Text, useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"

export const SITE_NAME = "GulaTools"

export const pageTitle = (locale: Locale, title?: string) =>
  title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: ${ui[locale].site.tagline}`

export function usePageMeta(title?: Text, description?: Text) {
  const locale = useLocale()
  const titleText = title && localize(title, locale)
  const descriptionText = description ? localize(description, locale) : ui[locale].site.description

  useEffect(() => {
    document.title = pageTitle(locale, titleText)
    document.querySelector('meta[name="description"]')?.setAttribute("content", descriptionText)
  }, [locale, titleText, descriptionText])
}

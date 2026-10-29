import { Languages, X } from "lucide-react"
import { useLocation } from "react-router"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { browserLocale, localizePath, routerBasename, useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { createPersistentStore } from "@/lib/store"

const dismissed = createPersistentStore<boolean>(
  "gulatools:language-hint-dismissed",
  () => false,
  (raw) => (typeof raw === "boolean" ? raw : undefined),
)

export function LanguageHint() {
  const locale = useLocale()
  const { pathname } = useLocation()
  const isDismissed = dismissed.use()
  const target = browserLocale()
  if (isDismissed || target === locale) return null

  const t = ui[target].shell
  const href = localizePath(`${routerBasename(locale) ?? ""}${pathname}`, target)

  return (
    <GlassPanel lang={target} className="mb-4 flex items-center gap-3 px-4 py-2.5 text-sm">
      <Languages aria-hidden="true" className="size-4 shrink-0" />
      <p className="flex-1">
        {t.languageHint}{" "}
        <a href={href} hrefLang={target} className="font-medium underline underline-offset-4">
          {t.openLanguage}
        </a>
      </p>
      <button
        type="button"
        aria-label={t.close}
        onClick={() => dismissed.set(true)}
        className={glassButtonClass("frost", "size-8 shrink-0 px-0")}
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </GlassPanel>
  )
}

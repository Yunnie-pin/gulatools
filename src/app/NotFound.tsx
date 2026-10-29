import { ChevronRight, House, Search, SearchX } from "lucide-react"
import { useMemo } from "react"
import { Link, useLocation } from "react-router"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { localize, useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { usePageMeta } from "@/lib/meta"
import { openPalette, PALETTE_SHORTCUT } from "@/lib/palette"
import { queryFromPath, searchTools } from "@/tools/search"

const MAX_SUGGESTIONS = 4

export function NotFound() {
  const locale = useLocale()
  const t = ui[locale].notFound
  const { pathname } = useLocation()
  usePageMeta(t.meta)

  const suggestions = useMemo(() => {
    const query = queryFromPath(pathname)
    return query ? searchTools(query).slice(0, MAX_SUGGESTIONS) : []
  }, [pathname])

  return (
    <GlassPanel className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-6 px-6 py-8 sm:mt-16 sm:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-glass-sm bg-white/60 shadow-[inset_0_1px_0_white,0_0_0_1px_rgba(0,0,0,.08)] dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_0_0_1px_rgba(255,255,255,.08)]">
          <SearchX aria-hidden="true" className="size-7" />
        </span>
        <p className="font-mono text-sm text-ink-soft">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-ink-soft">{t.lead}</p>
        <code className="max-w-full rounded-glass-sm bg-black/5 px-3 py-1.5 font-mono text-sm break-all dark:bg-white/10">
          {pathname}
        </code>
      </div>

      {suggestions.length > 0 && (
        <nav aria-labelledby="suggestions-heading" className="flex flex-col gap-2">
          <h2 id="suggestions-heading" className="text-sm font-medium text-ink-soft">
            {t.suggestions}
          </h2>
          <ul className="flex flex-col gap-1">
            {suggestions.map((tool) => (
              <li key={tool.id}>
                <Link
                  to={`/${tool.id}`}
                  className="flex items-center gap-3 rounded-glass-sm px-3 py-2 transition hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <tool.icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{tool.name}</span>
                    <span className="block truncate text-xs text-ink-soft">{localize(tool.short, locale)}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-soft" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/" className={glassButtonClass("key")}>
          <House aria-hidden="true" className="size-4" />
          {t.back}
        </Link>
        <button type="button" onClick={openPalette} className={glassButtonClass("frost")}>
          <Search aria-hidden="true" className="size-4" />
          {t.search}
          <kbd className="font-mono text-xs text-ink-soft">{PALETTE_SHORTCUT}</kbd>
        </button>
      </div>
    </GlassPanel>
  )
}

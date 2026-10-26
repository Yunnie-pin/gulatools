import { ChevronRight, Lock, Star } from "lucide-react"
import { lazy, Suspense, useEffect } from "react"
import { Link } from "react-router"
import { Badge } from "@/components/Badge"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { cx } from "@/lib/cx"
import { usePageMeta } from "@/lib/meta"
import { ToolStateProvider } from "@/lib/persist"
import { CATEGORIES, type Tool } from "@/lib/tool"
import { recordVisit, toggleFavorite, useUsage } from "@/lib/usage"
import { useAfterFirstPaint } from "@/lib/use-after-paint"

export function ToolPage({ tool }: { tool: Tool }) {
  const { favorites } = useUsage()
  const favorite = favorites.includes(tool.id)
  const locale = useLocale()
  const t = ui[locale].tool
  const favoriteLabel = favorite ? t.removeFavorite : t.addFavorite

  useEffect(() => recordVisit(tool.id), [tool.id])
  usePageMeta(tool.name, tool.description)
  const painted = useAfterFirstPaint()

  return (
    <div className="flex flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-col gap-3 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-glass-sm bg-white/60 shadow-[inset_0_1px_0_white,0_0_0_1px_rgba(0,0,0,.08)] dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_0_0_1px_rgba(255,255,255,.08)]">
            <tool.icon aria-hidden="true" className="size-[22px]" />
          </span>
          <div className="min-w-0 flex-1">
            <nav aria-label="Breadcrumb" className="mb-0.5 flex items-center gap-1 text-xs text-ink-soft">
              <Link to="/" className="rounded-sm hover:text-ink">
                {t.home}
              </Link>
              <ChevronRight aria-hidden="true" className="size-3.5" />
              <span>{CATEGORIES[tool.category].name}</span>
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight">{tool.name}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {tool.sensitive && (
              <span className="hidden sm:inline-flex">
                <Badge tone="success" icon={Lock}>
                  {t.local}
                </Badge>
              </span>
            )}
            <button
              type="button"
              aria-pressed={favorite}
              aria-label={favoriteLabel}
              title={favoriteLabel}
              onClick={() => toggleFavorite(tool.id)}
              className={glassButtonClass("frost", "w-9 px-0")}
            >
              <Star aria-hidden="true" className={cx("size-4", favorite && "fill-amber-400 text-amber-400")} />
            </button>
          </div>
        </div>
        <p className="text-sm text-ink-soft sm:pl-15">{tool.description[locale]}</p>
        {tool.sensitive && (
          <span className="sm:hidden">
            <Badge tone="success" icon={Lock}>
              {t.local}
            </Badge>
          </span>
        )}
      </GlassPanel>
      <ToolStateProvider value={tool.id}>
        <Suspense fallback={<ToolSkeleton />}>{painted ? <tool.Component /> : <ToolSkeleton />}</Suspense>
      </ToolStateProvider>
      <Suspense>{painted && <ToolAbout tool={tool} />}</Suspense>
    </div>
  )
}

const ToolAbout = lazy(() => import("./ToolAbout"))

const ToolSkeleton = () => <GlassPanel className="min-h-80 flex-1 animate-pulse" />

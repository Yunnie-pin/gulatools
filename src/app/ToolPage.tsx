import { ChevronRight, Lock, Star } from "lucide-react"
import { Suspense, useEffect } from "react"
import { Link } from "react-router"
import { Badge } from "@/components/Badge"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { cx } from "@/lib/cx"
import { CATEGORIES, type Tool } from "@/lib/tool"
import { recordVisit, toggleFavorite, useUsage } from "@/lib/usage"

export function ToolPage({ tool }: { tool: Tool }) {
  const { favorites } = useUsage()
  const favorite = favorites.includes(tool.id)

  useEffect(() => recordVisit(tool.id), [tool.id])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-4 px-6 py-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-glass-sm bg-white/60 shadow-[inset_0_1px_0_white,0_0_0_1px_rgba(0,0,0,.08)] dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_0_0_1px_rgba(255,255,255,.08)]">
          <tool.icon aria-hidden="true" className="size-[22px]" />
        </span>
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="mb-0.5 flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="rounded-sm hover:text-ink">
              Beranda
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <span>{CATEGORIES[tool.category].name}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight">{tool.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">{tool.description}</p>
        </div>
        {tool.sensitive && (
          <Badge tone="success" icon={Lock}>
            Diproses lokal
          </Badge>
        )}
        <button
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          title={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          onClick={() => toggleFavorite(tool.id)}
          className={glassButtonClass("frost", "w-9 px-0")}
        >
          <Star aria-hidden="true" className={cx("size-4", favorite && "fill-amber-400 text-amber-400")} />
        </button>
      </GlassPanel>
      <Suspense fallback={<GlassPanel className="flex-1 animate-pulse" />}>
        <tool.Component />
      </Suspense>
    </div>
  )
}

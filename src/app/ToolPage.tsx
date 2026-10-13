import { ChevronRight, Lock } from "lucide-react"
import { Suspense } from "react"
import { Link } from "react-router"
import { Badge } from "@/components/Badge"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { CATEGORIES, type Tool } from "@/lib/tool"

export function ToolPage({ tool }: { tool: Tool }) {
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
      </GlassPanel>
      <Suspense fallback={<GlassPanel className="flex-1 animate-pulse" />}>
        <tool.Component />
      </Suspense>
    </div>
  )
}

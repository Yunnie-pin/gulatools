import { History, Trash2 } from "lucide-react"
import { Link } from "react-router"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { SectionHeading } from "@/components/SectionHeading"
import { relativeTime } from "@/lib/time"
import { toast } from "@/lib/toast"
import { clearRecent, useUsage } from "@/lib/usage"
import { findTool } from "@/tools/registry"

const JUST_NOW_MS = 60_000

const visitedLabel = (at: number) => (Date.now() - at < JUST_NOW_MS ? "Baru saja" : relativeTime(new Date(at)))

export function ContinueStrip() {
  const { recent } = useUsage()
  const entries = recent.flatMap(({ id, at }) => {
    const tool = findTool(id)
    return tool ? [{ tool, at }] : []
  })

  if (!entries.length) return null

  return (
    <section aria-labelledby="continue-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading id="continue-heading" icon={History} as="h3">
          Lanjutkan
        </SectionHeading>
        <button
          type="button"
          onClick={() => {
            clearRecent()
            toast("Riwayat dihapus")
          }}
          className={glassButtonClass("frost", "h-8 gap-1.5 px-3 text-xs text-ink-soft")}
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
          Hapus riwayat
        </button>
      </div>
      <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pt-1 pb-3 [scrollbar-width:thin]">
        {entries.map(({ tool, at }) => (
          <li key={tool.id} className="shrink-0">
            <Link
              to={`/${tool.id}`}
              className="glass flex items-center gap-3 rounded-full py-2 pr-4 pl-2 transition duration-200 ease-glass hover:-translate-y-0.5 hover:bg-glass-hover"
            >
              <span className="grid size-8 place-items-center rounded-full bg-white/60 dark:bg-white/10">
                <tool.icon aria-hidden="true" className="size-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium whitespace-nowrap">{tool.name}</span>
                <span className="text-xs whitespace-nowrap text-ink-soft">{visitedLabel(at)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

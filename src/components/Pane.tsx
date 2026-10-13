import type { ReactNode } from "react"
import { cx } from "@/lib/cx"
import { GlassPanel } from "./glass/GlassPanel"

type PaneProps = {
  title: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function Pane({ title, action, className, children }: PaneProps) {
  return (
    <GlassPanel variant="solid" className={cx("flex min-h-0 flex-col overflow-hidden", className)}>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-black/5 px-4 dark:border-white/10">
        <h2 className="text-sm font-medium text-ink-soft">{title}</h2>
        {action}
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </GlassPanel>
  )
}

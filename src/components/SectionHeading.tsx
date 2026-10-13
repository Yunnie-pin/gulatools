import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cx } from "@/lib/cx"

type SectionHeadingProps = {
  id: string
  icon?: LucideIcon
  as?: "h2" | "h3"
  className?: string
  children: ReactNode
}

export function SectionHeading({ id, icon: Icon, as: Tag = "h2", className, children }: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      className={cx(
        "flex items-center gap-2 px-1 font-semibold tracking-wide text-ink uppercase",
        Tag === "h2" ? "text-sm" : "text-xs text-ink-soft",
        className,
      )}
    >
      {Icon && <Icon aria-hidden="true" className="size-4" />}
      {children}
    </Tag>
  )
}

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cx } from "@/lib/cx"

const tones = {
  neutral: "bg-black/5 text-ink dark:bg-white/10",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
}

type BadgeProps = {
  tone?: keyof typeof tones
  icon?: LucideIcon
  children: ReactNode
}

export function Badge({ tone = "neutral", icon: Icon, children }: BadgeProps) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>
      {Icon && <Icon aria-hidden="true" className="size-3.5" />}
      {children}
    </span>
  )
}

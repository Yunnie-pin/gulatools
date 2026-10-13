import type { ComponentProps } from "react"
import { cx } from "@/lib/cx"

export const glassFieldClass =
  "h-10 w-full rounded-glass-sm bg-white/70 px-3 text-sm text-ink shadow-[inset_0_1px_2px_rgba(0,0,0,.08),0_0_0_1px_rgba(0,0,0,.1)] outline-none transition placeholder:text-ink-soft focus-visible:shadow-[0_0_0_2px_var(--focus)] dark:bg-black/30 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,.4),0_0_0_1px_rgba(255,255,255,.1)]"

export function GlassInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cx(glassFieldClass, className)} {...props} />
}

export function GlassTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      spellCheck={false}
      className={cx(glassFieldClass, "h-auto resize-y py-2.5 font-mono break-all", className)}
      {...props}
    />
  )
}

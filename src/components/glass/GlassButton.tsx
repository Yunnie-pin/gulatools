import type { ComponentProps } from "react"
import { cx } from "@/lib/cx"

type Variant = "frost" | "key"

const variants: Record<Variant, string> = {
  frost:
    "bg-white/60 text-ink shadow-[inset_0_1px_0_white,0_0_0_1px_rgba(0,0,0,.12)] hover:bg-white/80 dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_0_0_1px_rgba(255,255,255,.1)] dark:hover:bg-white/15",
  key: "bg-[radial-gradient(120%_90%_at_50%_0%,#3a3a3f_0%,#121214_55%,#050506_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_0_0_1px_rgba(0,0,0,.75),0_10px_18px_-8px_rgba(0,0,0,.55)] dark:bg-[radial-gradient(120%_90%_at_50%_0%,#fff_0%,#ececee_55%,#d2d2d6_100%)] dark:text-[#111113]",
}

export const glassButtonClass = (variant: Variant = "frost", className?: string) =>
  cx(
    "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-glass-sm px-3.5 text-sm font-medium whitespace-nowrap transition duration-300 ease-spring active:scale-95 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  )

type GlassButtonProps = ComponentProps<"button"> & { variant?: Variant }

export function GlassButton({ variant, className, type = "button", ...props }: GlassButtonProps) {
  return <button type={type} className={glassButtonClass(variant, className)} {...props} />
}

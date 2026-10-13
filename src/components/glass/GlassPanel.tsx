import type { ComponentProps } from "react"
import { cx } from "@/lib/cx"

type GlassPanelProps = ComponentProps<"div"> & {
  variant?: "default" | "strong" | "solid"
}

export function GlassPanel({ variant = "default", className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cx(
        "glass rounded-glass",
        variant === "strong" && "glass-strong",
        variant === "solid" && "glass-solid",
        className,
      )}
      {...props}
    />
  )
}

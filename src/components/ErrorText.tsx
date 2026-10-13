import { TriangleAlert } from "lucide-react"
import type { ReactNode } from "react"
import { cx } from "@/lib/cx"

export function ErrorText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={cx("flex items-start gap-2 text-sm text-danger", className)}>
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  )
}

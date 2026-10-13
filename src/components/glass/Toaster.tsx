import { Check, TriangleAlert } from "lucide-react"
import { cx } from "@/lib/cx"
import { useToasts } from "@/lib/toast"

export function Toaster() {
  const toasts = useToasts()

  return (
    <output
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2"
    >
      {toasts.map((t) => {
        const Icon = t.tone === "error" ? TriangleAlert : Check
        return (
          <div
            key={t.id}
            className={cx(
              "glass glass-strong flex animate-[toast-in_.4s_var(--spring)] items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
              t.tone === "error" ? "text-danger" : "text-ink",
            )}
          >
            <Icon aria-hidden="true" className={cx("size-4", t.tone === "info" && "text-success")} />
            {t.message}
          </div>
        )
      })}
    </output>
  )
}

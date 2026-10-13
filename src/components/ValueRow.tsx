import { CopyButton } from "./CopyButton"

type ValueRowProps = {
  label: string
  value: string
  truncateAt?: number
}

export function ValueRow({ label, value, truncateAt }: ValueRowProps) {
  const shown = truncateAt && value.length > truncateAt ? `${value.slice(0, truncateAt)}…` : value

  return (
    <div className="flex items-center gap-3 border-b border-black/5 py-2.5 last:border-0 dark:border-white/10">
      <span className="w-32 shrink-0 text-sm text-ink-soft">{label}</span>
      <code className="min-w-0 flex-1 font-mono text-sm break-all">{shown || "—"}</code>
      <CopyButton text={value} />
    </div>
  )
}

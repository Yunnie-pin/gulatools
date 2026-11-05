import { Eraser, RefreshCw, Sparkles } from "lucide-react"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { shortcutTarget } from "@/lib/shortcuts"
import { GlassButton } from "./glass/GlassButton"

type ActionProps = {
  onClick: () => void
  disabled?: boolean
}

export function SampleButton({ onClick }: ActionProps) {
  const t = useMessages(ui).common
  return (
    <GlassButton onClick={onClick} {...shortcutTarget("sample", t.sample)}>
      <Sparkles aria-hidden="true" className="size-4" />
      {t.sample}
    </GlassButton>
  )
}

export function ClearButton({ onClick, disabled }: ActionProps) {
  const t = useMessages(ui).common
  return (
    <GlassButton onClick={onClick} disabled={disabled} {...shortcutTarget("clear", t.clear)}>
      <Eraser aria-hidden="true" className="size-4" />
      {t.clear}
    </GlassButton>
  )
}

export function RegenerateButton({ onClick, className }: ActionProps & { className?: string }) {
  const t = useMessages(ui).common
  return (
    <GlassButton variant="key" onClick={onClick} className={className} {...shortcutTarget("run", t.regenerate)}>
      <RefreshCw aria-hidden="true" className="size-4" />
      {t.regenerate}
    </GlassButton>
  )
}

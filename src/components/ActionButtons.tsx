import { Eraser, RefreshCw, Sparkles } from "lucide-react"
import { GlassButton } from "./glass/GlassButton"

type ActionProps = {
  onClick: () => void
  disabled?: boolean
}

export function SampleButton({ onClick }: ActionProps) {
  return (
    <GlassButton onClick={onClick}>
      <Sparkles aria-hidden="true" className="size-4" />
      Contoh
    </GlassButton>
  )
}

export function ClearButton({ onClick, disabled }: ActionProps) {
  return (
    <GlassButton onClick={onClick} disabled={disabled}>
      <Eraser aria-hidden="true" className="size-4" />
      Bersihkan
    </GlassButton>
  )
}

export function RegenerateButton({ onClick, className }: ActionProps & { className?: string }) {
  return (
    <GlassButton variant="key" onClick={onClick} className={className}>
      <RefreshCw aria-hidden="true" className="size-4" />
      Generate ulang
    </GlassButton>
  )
}

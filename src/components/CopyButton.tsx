import { Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { toast } from "@/lib/toast"
import { GlassButton } from "./glass/GlassButton"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const t = useMessages(ui).common

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast(t.copied)
    } catch {
      toast(t.copyFailed, "error")
    }
  }

  const Icon = copied ? Check : Copy

  return (
    <GlassButton onClick={copy} disabled={!text}>
      <Icon aria-hidden="true" className="size-4" />
      {t.copy}
    </GlassButton>
  )
}

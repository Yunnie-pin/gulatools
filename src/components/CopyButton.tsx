import { Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { shortcutTarget } from "@/lib/shortcuts"
import { toast } from "@/lib/toast"
import { GlassButton } from "./glass/GlassButton"

/** `shortcut` marks the main output, so Alt+C copies it. */
export function CopyButton({ text, shortcut = false }: { text: string; shortcut?: boolean }) {
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
    <GlassButton onClick={copy} disabled={!text} {...(shortcut ? shortcutTarget("copy", t.copy) : {})}>
      <Icon aria-hidden="true" className="size-4" />
      {t.copy}
    </GlassButton>
  )
}

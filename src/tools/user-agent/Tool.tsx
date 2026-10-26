import { Monitor } from "lucide-react"
import { useMemo } from "react"
import { ClearButton } from "@/components/ActionButtons"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { parseUserAgent } from "./logic"
import { messages } from "./messages"

export default function UserAgentTool() {
  const t = useMessages(messages)
  const [userAgent, setUserAgent] = usePersistentState("userAgent", "")
  const info = useMemo(() => (userAgent.trim() ? parseUserAgent(userAgent) : null), [userAgent])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <GlassTextarea
          aria-label="User-Agent"
          rows={3}
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          placeholder="Mozilla/5.0 (…)"
          spellCheck={false}
          className="font-mono"
        />
        <div className="flex flex-wrap gap-2">
          <GlassButton onClick={() => setUserAgent(navigator.userAgent)}>
            <Monitor aria-hidden="true" className="size-4" />
            {t.useMine}
          </GlassButton>
          <ClearButton onClick={() => setUserAgent("")} disabled={!userAgent} />
        </div>
      </GlassPanel>

      {info && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          <ValueRow label="Browser" value={info.browser} />
          <ValueRow label="Engine" value={info.engine} />
          <ValueRow label={t.os} value={info.os} />
          <ValueRow label={t.deviceType} value={t.deviceTypes[info.deviceType] ?? info.deviceType} />
          <ValueRow label={t.device} value={info.device} />
          <ValueRow label="CPU" value={info.cpu} />
        </GlassPanel>
      )}
      {info && <p className="text-xs text-ink-soft">{t.reducedHint}</p>}
    </div>
  )
}

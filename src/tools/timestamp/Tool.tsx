import { useMemo } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useLocale } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { formatDateTime, relativeTime } from "@/lib/time"
import { parseTimestamp } from "./logic"
import { messages } from "./messages"

const nowInSeconds = () => String(Math.floor(Date.now() / 1000))

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function TimestampTool() {
  const locale = useLocale()
  const t = messages[locale]
  const [input, setInput] = usePersistentState("input", nowInSeconds)
  const parsed = useMemo(() => attempt(() => parseTimestamp(input)), [input])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <GlassInput
            aria-label={t.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            className="font-mono"
          />
          <GlassButton onClick={() => setInput(nowInSeconds())}>{t.now}</GlassButton>
        </div>
        {parsed.ok ? (
          <div className="flex gap-2">
            <Badge>{t.readAs(t.units[parsed.value.unit])}</Badge>
          </div>
        ) : (
          <ErrorText>{parsed.error}</ErrorText>
        )}
      </GlassPanel>

      {parsed.ok && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          <ValueRow label={t.unixSeconds} value={String(Math.floor(parsed.value.date.getTime() / 1000))} />
          <ValueRow label={t.unixMillis} value={String(parsed.value.date.getTime())} />
          <ValueRow label="ISO 8601 (UTC)" value={parsed.value.date.toISOString()} />
          <ValueRow label="RFC 7231" value={parsed.value.date.toUTCString()} />
          <ValueRow label={t.local(timeZone)} value={formatDateTime(parsed.value.date, locale)} />
          <ValueRow label={t.relative} value={relativeTime(parsed.value.date, locale)} />
        </GlassPanel>
      )}
    </div>
  )
}

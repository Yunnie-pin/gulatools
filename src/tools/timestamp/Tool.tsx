import { useMemo, useState } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { attempt } from "@/lib/result"
import { formatDateTime, relativeTime } from "@/lib/time"
import { parseTimestamp } from "./logic"

const nowInSeconds = () => String(Math.floor(Date.now() / 1000))

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function TimestampTool() {
  const [input, setInput] = useState(nowInSeconds)
  const parsed = useMemo(() => attempt(() => parseTimestamp(input)), [input])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <GlassInput
            aria-label="Timestamp atau tanggal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1760000000 atau 2026-10-13T08:00:00Z"
            spellCheck={false}
            className="font-mono"
          />
          <GlassButton onClick={() => setInput(nowInSeconds())}>Sekarang</GlassButton>
        </div>
        {parsed.ok ? (
          <div className="flex gap-2">
            <Badge>Terbaca sebagai {parsed.value.unit}</Badge>
          </div>
        ) : (
          <ErrorText>{parsed.error}</ErrorText>
        )}
      </GlassPanel>

      {parsed.ok && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          <ValueRow label="Unix (detik)" value={String(Math.floor(parsed.value.date.getTime() / 1000))} />
          <ValueRow label="Unix (milidetik)" value={String(parsed.value.date.getTime())} />
          <ValueRow label="ISO 8601 (UTC)" value={parsed.value.date.toISOString()} />
          <ValueRow label="RFC 7231" value={parsed.value.date.toUTCString()} />
          <ValueRow label={`Lokal (${timeZone})`} value={formatDateTime(parsed.value.date)} />
          <ValueRow label="Relatif" value={relativeTime(parsed.value.date)} />
        </GlassPanel>
      )}
    </div>
  )
}

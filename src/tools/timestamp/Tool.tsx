import { Plus, X } from "lucide-react"
import { useId, useMemo, useState } from "react"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { ValueRow } from "@/components/ValueRow"
import { useLocale } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { formatDateTime, relativeTime } from "@/lib/time"
import { durationBetween, formatInZone, isTimeZone, parseTimestamp, zoneOffset } from "./logic"
import { messages } from "./messages"

const nowInSeconds = () => String(Math.floor(Date.now() / 1000))

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const ALL_ZONES = Intl.supportedValuesOf("timeZone")

const DEFAULT_ZONES = ["UTC", "Asia/Jakarta", "Europe/London", "America/New_York", "Asia/Tokyo"]

const isZoneList = (value: unknown) => Array.isArray(value) && value.every((zone) => typeof zone === "string")

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
        <>
          <GlassPanel variant="solid" className="px-4 py-1.5">
            <ValueRow label={t.unixSeconds} value={String(Math.floor(parsed.value.date.getTime() / 1000))} />
            <ValueRow label={t.unixMillis} value={String(parsed.value.date.getTime())} />
            <ValueRow label="ISO 8601 (UTC)" value={parsed.value.date.toISOString()} />
            <ValueRow label="RFC 7231" value={parsed.value.date.toUTCString()} />
            <ValueRow label={t.local(timeZone)} value={formatDateTime(parsed.value.date, locale)} />
            <ValueRow label={t.relative} value={relativeTime(parsed.value.date, locale)} />
          </GlassPanel>
          <div className="grid gap-4 lg:grid-cols-2">
            <ZonesPanel date={parsed.value.date} />
            <DifferencePanel date={parsed.value.date} />
          </div>
        </>
      )}
    </div>
  )
}

function ZonesPanel({ date }: { date: Date }) {
  const locale = useLocale()
  const t = messages[locale]
  const listId = useId()
  const [zones, setZones] = usePersistentState<string[]>("zones", DEFAULT_ZONES, isZoneList)
  const [draft, setDraft] = useState("")
  const valid = isTimeZone(draft) && !zones.includes(draft)

  const add = () => {
    if (!valid) return
    setZones([...zones, draft])
    setDraft("")
  }

  return (
    <Pane title={t.zones}>
      <form
        className="flex gap-2 border-b border-black/5 p-3 dark:border-white/10"
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
      >
        <GlassInput
          aria-label={t.addZone}
          list={listId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Asia/Makassar"
          spellCheck={false}
          className="min-w-0 flex-1"
        />
        <datalist id={listId}>
          {ALL_ZONES.map((zone) => (
            <option key={zone} value={zone} />
          ))}
        </datalist>
        <GlassButton type="submit" disabled={!valid}>
          <Plus aria-hidden="true" className="size-4" />
          {t.add}
        </GlassButton>
      </form>
      <ul className="px-4 py-1.5">
        {zones.filter(isTimeZone).map((zone) => {
          const formatted = formatInZone(date, zone, locale)
          return (
            <li
              key={zone}
              className="flex items-center gap-3 border-b border-black/5 py-2.5 last:border-0 dark:border-white/10"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-soft">
                  {zone} <span className="font-mono text-xs">{zoneOffset(date, zone)}</span>
                </p>
                <p className="text-sm">{formatted}</p>
              </div>
              <CopyButton text={formatted} />
              <GlassButton
                aria-label={t.removeZone(zone)}
                title={t.removeZone(zone)}
                onClick={() => setZones(zones.filter((other) => other !== zone))}
                className="w-9 shrink-0 px-0"
              >
                <X aria-hidden="true" className="size-4" />
              </GlassButton>
            </li>
          )
        })}
      </ul>
    </Pane>
  )
}

function DifferencePanel({ date }: { date: Date }) {
  const locale = useLocale()
  const t = messages[locale]
  const [other, setOther] = usePersistentState("compare", "")
  const parsed = useMemo(() => (other.trim() ? attempt(() => parseTimestamp(other)) : null), [other])
  const duration = parsed?.ok ? durationBetween(date, parsed.value.date) : null

  return (
    <Pane title={t.difference}>
      <div className="flex flex-col gap-3 p-4">
        <GlassInput
          aria-label={t.compareWith}
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className="font-mono"
        />
        {parsed && !parsed.ok && <ErrorText>{parsed.error}</ErrorText>}
        {duration && (
          <div>
            <ValueRow label={t.duration} value={t.formatDuration(duration)} />
            <ValueRow label={t.totalSeconds} value={duration.totalSeconds.toLocaleString(locale)} />
            <ValueRow label={t.totalDays} value={(duration.totalSeconds / 86400).toLocaleString(locale)} />
          </div>
        )}
      </div>
    </Pane>
  )
}

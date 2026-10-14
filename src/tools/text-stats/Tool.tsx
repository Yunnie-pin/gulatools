import { EyeOff, ShieldAlert } from "lucide-react"
import { useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { analyzeText, formatCodePoint, type TextStats } from "./logic"
import { messages } from "./messages"

const SAMPLE = `Gula${String.fromCodePoint(0x200b)} manis${String.fromCodePoint(0xa0)}dan kopi pahit.\nSatu keluarga: ${String.fromCodePoint(0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467)}`

const COUNTS = [
  "graphemes",
  "words",
  "lines",
  "codePoints",
  "utf16Units",
  "utf8Bytes",
] as const satisfies readonly (keyof TextStats)[]

export default function TextStatsTool() {
  const t = useMessages(messages)
  const [text, setText] = usePersistentState("text", "")
  const stats = useMemo(() => analyzeText(text), [text])
  const hasBidi = stats.hidden.some((char) => char.bidi)

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <GlassTextarea
          aria-label={t.textLabel}
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          className="font-sans"
        />
        <div className="flex gap-2">
          <SampleButton onClick={() => setText(SAMPLE)} />
          <ClearButton onClick={() => setText("")} disabled={!text} />
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="p-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COUNTS.map((key) => (
            <div key={key} className="flex flex-col gap-0.5">
              <dt className="text-sm text-ink-soft">{t[key]}</dt>
              <dd className="font-mono text-2xl tabular-nums">{stats[key].toLocaleString()}</dd>
            </div>
          ))}
        </dl>
      </GlassPanel>

      {text && (
        <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={stats.hidden.length ? "danger" : "success"} icon={EyeOff}>
              {stats.hidden.length ? t.hiddenTitle(stats.hidden.length) : t.noHidden}
            </Badge>
            {hasBidi && (
              <Badge tone="danger" icon={ShieldAlert}>
                {t.bidiWarning}
              </Badge>
            )}
            {stats.hidden.length > 0 && (
              <span className="ml-auto inline-flex items-center gap-2 text-sm text-ink-soft">
                {t.copyCleaned}
                <CopyButton text={stats.cleaned} />
              </span>
            )}
          </div>
          {stats.hidden.length > 0 && (
            <ul>
              {stats.hidden.map((char) => (
                <li
                  key={char.codePoint}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/10"
                >
                  <code className="w-20 font-mono">{formatCodePoint(char.codePoint)}</code>
                  <span className="flex-1">{char.name}</span>
                  <span className="text-ink-soft tabular-nums">{t.position(char.line, char.column, char.count)}</span>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>
      )}
    </div>
  )
}

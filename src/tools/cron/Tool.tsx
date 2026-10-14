import { useMemo, useState } from "react"
import { ErrorText } from "@/components/ErrorText"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { useLocale } from "@/i18n/locale"
import { attempt } from "@/lib/result"
import { formatDateTime, relativeTime } from "@/lib/time"
import { explainCron, PRESETS } from "./logic"
import { messages } from "./messages"

export default function CronTool() {
  const [expression, setExpression] = useState("0 9 * * 1-5")
  const locale = useLocale()
  const t = messages[locale]
  const info = useMemo(() => attempt(() => explainCron(expression, { locale })), [expression, locale])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <GlassInput
          aria-label={t.expression}
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          spellCheck={false}
          className="h-12 text-center font-mono text-lg tracking-widest"
        />
        <p className="text-center font-mono text-xs text-ink-soft">{t.fields.join(" · ")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((preset) => (
            <GlassButton key={preset} onClick={() => setExpression(preset)}>
              {t.presets[preset]}
            </GlassButton>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="p-5">
        {info.ok ? (
          <div className="flex flex-col gap-4">
            <p className="text-xl font-medium">{info.value.description}</p>
            <div>
              <h2 className="mb-2 text-sm font-medium text-ink-soft">{t.nextRuns}</h2>
              <ol className="flex flex-col">
                {info.value.nextRuns.map((date) => (
                  <li
                    key={date.getTime()}
                    className="flex justify-between gap-4 border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/10"
                  >
                    <span className="font-mono">{formatDateTime(date, locale)}</span>
                    <span className="text-ink-soft">{relativeTime(date, locale)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <ErrorText>{info.error}</ErrorText>
        )}
      </GlassPanel>
    </div>
  )
}

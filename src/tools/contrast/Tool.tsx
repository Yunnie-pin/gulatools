import { ArrowLeftRight, CircleCheck, CircleX } from "lucide-react"
import { useMemo } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { CHECKS, checkContrast } from "./logic"
import { messages } from "./messages"

type ColorFieldProps = {
  label: string
  pickLabel: string
  value: string
  picked: string
  onChange: (value: string) => void
}

function ColorField({ label, pickLabel, value, picked, onChange }: ColorFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 gap-2">
      <GlassInput
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="font-mono"
      />
      <input
        type="color"
        aria-label={pickLabel}
        value={picked}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-glass-sm bg-transparent"
      />
    </div>
  )
}

export default function ContrastTool() {
  const t = useMessages(messages)
  const [foreground, setForeground] = usePersistentState("foreground", "#5c5c5c")
  const [background, setBackground] = usePersistentState("background", "#ffffff")
  const result = useMemo(() => attempt(() => checkContrast(foreground, background)), [foreground, background])

  const swap = () => {
    setForeground(background)
    setBackground(foreground)
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ColorField
            label={t.foreground}
            pickLabel={t.pick(t.foreground)}
            value={foreground}
            picked={result.ok ? result.value.foreground : "#000000"}
            onChange={setForeground}
          />
          <GlassButton onClick={swap} aria-label={t.swap} title={t.swap} className="shrink-0 self-center">
            <ArrowLeftRight aria-hidden="true" className="size-4" />
          </GlassButton>
          <ColorField
            label={t.background}
            pickLabel={t.pick(t.background)}
            value={background}
            picked={result.ok ? result.value.background : "#ffffff"}
            onChange={setBackground}
          />
        </div>
        {!result.ok && <ErrorText>{result.error}</ErrorText>}
      </GlassPanel>

      {result.ok && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className="flex flex-col justify-center gap-3 rounded-glass-md p-6 shadow-[inset_0_0_0_1px_rgba(0,0,0,.1)]"
            style={{ background: result.value.background, color: foreground }}
          >
            <p className="text-base">{t.sampleNormal}</p>
            <p className="text-2xl font-semibold">{t.sampleLarge}</p>
          </div>

          <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-ink-soft">{t.ratio}</span>
              <span className="font-mono text-3xl tabular-nums">{result.value.ratio.toFixed(2)}:1</span>
            </div>
            <ul>
              {CHECKS.map(({ id, level, min }) => {
                const passes = result.value.passes[id]
                return (
                  <li
                    key={id}
                    className="flex items-center gap-3 border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/10"
                  >
                    <span className="w-10 font-medium">{level}</span>
                    <span className="flex-1">{t.checks[id]}</span>
                    <span className="text-ink-soft tabular-nums">{min}:1</span>
                    <Badge tone={passes ? "success" : "danger"} icon={passes ? CircleCheck : CircleX}>
                      {passes ? t.pass : t.fail}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </GlassPanel>
        </div>
      )}
    </div>
  )
}

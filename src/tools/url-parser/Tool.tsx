import { Plus, Trash2 } from "lucide-react"
import { useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { parseUrl, type QueryParam, withParams } from "./logic"
import { messages } from "./messages"

const SAMPLE = "https://user:secret@api.gulagulali.tech:8443/v1/cari%20alat?q=gula+manis&tag=json&tag=jwt&page=2#hasil"

export default function UrlParser() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "")
  const parsed = useMemo(() => (input.trim() ? attempt(() => parseUrl(input)) : null), [input])

  const setParams = (params: QueryParam[]) => setInput(withParams(input, params))

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-2 px-4 py-3">
        <GlassInput
          aria-label="URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?q=1"
          spellCheck={false}
          className="min-w-0 flex-1 basis-80 font-mono"
        />
        <SampleButton onClick={() => setInput(SAMPLE)} />
        <ClearButton onClick={() => setInput("")} disabled={!input} />
      </GlassPanel>

      {parsed && !parsed.ok && <ErrorText>{parsed.error}</ErrorText>}

      {parsed?.ok && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Pane title={t.parts}>
            <div className="px-4 py-1.5">
              {parsed.value.parts.map(([label, value]) => (
                <ValueRow key={label} label={label} value={value} />
              ))}
            </div>
          </Pane>

          <Pane
            title={t.params(parsed.value.params.length)}
            action={
              <GlassButton onClick={() => setParams([...parsed.value.params, ["", ""]])}>
                <Plus aria-hidden="true" className="size-4" />
                {t.add}
              </GlassButton>
            }
          >
            <div className="flex flex-col gap-2 p-4">
              {parsed.value.params.length === 0 && <p className="text-sm text-ink-soft">{t.noParams}</p>}
              {parsed.value.params.map(([key, value], index) => {
                const update = (next: QueryParam) =>
                  setParams(parsed.value.params.map((param, i) => (i === index ? next : param)))
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: params can repeat keys, so position is the identity
                  <div key={index} className="flex gap-2">
                    <GlassInput
                      aria-label={t.keyN(index + 1)}
                      value={key}
                      onChange={(e) => update([e.target.value, value])}
                      spellCheck={false}
                      className="w-2/5 min-w-0 font-mono"
                    />
                    <GlassInput
                      aria-label={t.valueN(index + 1)}
                      value={value}
                      onChange={(e) => update([key, e.target.value])}
                      spellCheck={false}
                      className="min-w-0 flex-1 font-mono"
                    />
                    <GlassButton
                      aria-label={t.removeN(index + 1)}
                      title={t.removeN(index + 1)}
                      onClick={() => setParams(parsed.value.params.filter((_, i) => i !== index))}
                      className="w-9 shrink-0 px-0"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </GlassButton>
                  </div>
                )
              })}
            </div>
          </Pane>

          <GlassPanel variant="solid" className="flex items-center gap-3 px-4 py-3 lg:col-span-2">
            <span className="shrink-0 text-sm text-ink-soft">{t.result}</span>
            <code className="min-w-0 flex-1 font-mono text-sm break-all">{parsed.value.href}</code>
            <CopyButton text={parsed.value.href} />
          </GlassPanel>
        </div>
      )}
    </div>
  )
}

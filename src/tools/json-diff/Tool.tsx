import { json } from "@codemirror/lang-json"
import { useDeferredValue, useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { ErrorText } from "@/components/ErrorText"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { cx } from "@/lib/cx"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { compareJson, formatValue, type JsonChange, toReport } from "./logic"
import { messages } from "./messages"

const language = json()

const SAMPLE_ORIGINAL = `{
  "name": "gulatools",
  "version": "1.0.0",
  "private": true,
  "tools": ["json", "jwt"],
  "author": { "name": "Gula" }
}`

const SAMPLE_MODIFIED = `{
  "name": "gulatools",
  "version": "1.1.0",
  "tools": ["json", "jwt", "totp"],
  "author": { "name": "Gula", "url": "https://gulagulali.tech" }
}`

const TONES = {
  added: "bg-success/15 text-success",
  removed: "bg-danger/15 text-danger",
  changed: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
} as const

const SIGNS = { added: "+", removed: "−", changed: "~" } as const

export default function JsonDiffTool() {
  const t = useMessages(messages)
  const [original, setOriginal] = usePersistentState("original", "")
  const [modified, setModified] = usePersistentState("modified", "")
  const deferredOriginal = useDeferredValue(original)
  const deferredModified = useDeferredValue(modified)
  const result = useMemo(
    () => attempt(() => compareJson(deferredOriginal, deferredModified)),
    [deferredOriginal, deferredModified],
  )
  const ready = Boolean(original.trim() && modified.trim())
  const count = (kind: JsonChange["kind"]) =>
    result.ok ? result.value.filter((change) => change.kind === kind).length : 0

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center justify-end gap-2 px-4 py-3">
        <SampleButton
          onClick={() => {
            setOriginal(SAMPLE_ORIGINAL)
            setModified(SAMPLE_MODIFIED)
          }}
        />
        <ClearButton
          onClick={() => {
            setOriginal("")
            setModified("")
          }}
          disabled={!original && !modified}
        />
      </GlassPanel>

      <div className="grid min-h-80 gap-4 lg:grid-cols-2">
        <Pane title={t.original}>
          <Editor label={t.original} value={original} onChange={setOriginal} language={language} />
        </Pane>
        <Pane title={t.modified}>
          <Editor label={t.modified} value={modified} onChange={setModified} language={language} />
        </Pane>
      </div>

      {ready && (
        <Pane
          title={t.difference}
          className="min-h-32"
          action={
            result.ok &&
            result.value.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge tone="success">+{count("added")}</Badge>
                <Badge tone="danger">−{count("removed")}</Badge>
                <Badge>~{count("changed")}</Badge>
                <CopyButton text={toReport(result.value)} />
              </div>
            )
          }
        >
          {!result.ok ? (
            <ErrorText className="p-4">{result.error}</ErrorText>
          ) : result.value.length === 0 ? (
            <p className="p-4 text-sm text-ink-soft">{t.identical}</p>
          ) : (
            <ul className="divide-y divide-black/5 font-mono text-sm dark:divide-white/10">
              {result.value.map((change) => (
                <li key={change.path} className="flex items-start gap-3 px-4 py-2">
                  <span
                    aria-hidden="true"
                    className={cx("grid size-5 shrink-0 place-items-center rounded", TONES[change.kind])}
                  >
                    {SIGNS[change.kind]}
                  </span>
                  <span className="sr-only">{t.kinds[change.kind]}</span>
                  <span className="min-w-0 flex-1 break-all">
                    <span className="font-medium">{change.path}</span>
                    <span className="text-ink-soft">: </span>
                    {change.kind !== "added" && (
                      <span className={cx(change.kind === "removed" ? "text-danger" : "text-ink-soft line-through")}>
                        {formatValue(change.before)}
                      </span>
                    )}
                    {change.kind === "changed" && <span className="text-ink-soft"> → </span>}
                    {change.kind !== "removed" && <span className="text-success">{formatValue(change.after)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Pane>
      )}
    </div>
  )
}

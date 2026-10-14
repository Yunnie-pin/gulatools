import type { Change } from "diff"
import { useDeferredValue, useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { cx } from "@/lib/cx"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { type DiffMode, diffTexts, summarize, toPatch } from "./logic"
import { messages } from "./messages"

const MODES = ["lines", "words", "chars"] as const satisfies readonly DiffMode[]

const SAMPLE_ORIGINAL = "name: gulatools\nversion: 1.0.0\nfeatures:\n  - json\n  - jwt\n"
const SAMPLE_MODIFIED = "name: gulatools\nversion: 1.1.0\nfeatures:\n  - json\n  - jwt\n  - bcrypt\n"

export default function DiffTool() {
  const t = useMessages(messages)
  const [original, setOriginal] = usePersistentState("original", "")
  const [modified, setModified] = usePersistentState("modified", "")
  const [mode, setMode] = usePersistentState<DiffMode>("mode", "lines", oneOf(MODES))
  const [ignoreWhitespace, setIgnoreWhitespace] = usePersistentState("ignoreWhitespace", false)

  const deferredOriginal = useDeferredValue(original)
  const deferredModified = useDeferredValue(modified)
  const changes = useMemo(
    () => diffTexts(deferredOriginal, deferredModified, mode, ignoreWhitespace),
    [deferredOriginal, deferredModified, mode, ignoreWhitespace],
  )
  const summary = summarize(changes)
  const hasInput = Boolean(original || modified)

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<DiffMode> label={t.unit} value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />
        {mode !== "chars" && (
          <Checkbox label={t.ignoreWhitespace} checked={ignoreWhitespace} onChange={setIgnoreWhitespace} />
        )}
        <div className="ml-auto flex gap-2">
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
            disabled={!hasInput}
          />
        </div>
      </GlassPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextPanel title={t.original} value={original} onChange={setOriginal} />
        <TextPanel title={t.modified} value={modified} onChange={setModified} />
      </div>

      {hasInput && (
        <Pane
          title={t.difference}
          className="min-h-48"
          action={
            <div className="flex items-center gap-2">
              <Badge tone="success">+{summary.added}</Badge>
              <Badge tone="danger">−{summary.removed}</Badge>
              <CopyButton text={toPatch(original, modified)} />
            </div>
          }
        >
          <pre className="p-4 font-mono text-sm break-all whitespace-pre-wrap">
            <Changes changes={changes} />
          </pre>
        </Pane>
      )}
    </div>
  )
}

function TextPanel({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return (
    <GlassPanel variant="solid" className="flex flex-col gap-2 p-4">
      <h2 className="text-sm font-medium text-ink-soft">{title}</h2>
      <GlassTextarea
        aria-label={title}
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono"
      />
    </GlassPanel>
  )
}

function Changes({ changes }: { changes: Change[] }) {
  let offset = 0
  return changes.map((change) => {
    const kind = change.added ? "added" : change.removed ? "removed" : "same"
    const key = `${offset}-${kind}`
    offset += change.value.length
    return (
      <span
        key={key}
        className={cx(
          change.added && "bg-success/20 text-success",
          change.removed && "bg-danger/20 text-danger line-through decoration-danger/50",
        )}
      >
        {change.value}
      </span>
    )
  })
}

import { useDeferredValue, useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { testGlobs } from "./logic"
import { messages } from "./messages"

const SAMPLE_PATTERNS = "src/**/*.{ts,tsx}\n!**/*.test.ts"
const SAMPLE_PATHS =
  "src/main.tsx\nsrc/app/Home.tsx\nsrc/lib/util.ts\nsrc/lib/util.test.ts\nREADME.md\n.github/workflows/ci.yml\nsrc/.env.ts"

export default function GlobTool() {
  const t = useMessages(messages)
  const [patterns, setPatterns] = usePersistentState("patterns", "")
  const [paths, setPaths] = usePersistentState("paths", "")
  const [dot, setDot] = usePersistentState("dot", false)
  const [nocase, setNocase] = usePersistentState("nocase", false)
  const deferredPaths = useDeferredValue(paths)
  const report = useMemo(
    () => attempt(() => testGlobs(patterns, deferredPaths, { dot, nocase })),
    [patterns, deferredPaths, dot, nocase],
  )

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Checkbox label={t.dot} checked={dot} onChange={setDot} />
        <Checkbox label={t.nocase} checked={nocase} onChange={setNocase} />
        <div className="ml-auto flex gap-2">
          <SampleButton
            onClick={() => {
              setPatterns(SAMPLE_PATTERNS)
              setPaths(SAMPLE_PATHS)
            }}
          />
          <ClearButton
            onClick={() => {
              setPatterns("")
              setPaths("")
            }}
            disabled={!patterns && !paths}
          />
        </div>
      </GlassPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextPanel title={t.patterns} hint={t.patternsHint} value={patterns} onChange={setPatterns} />
        <TextPanel title={t.paths} value={paths} onChange={setPaths} />
      </div>

      {!report.ok ? (
        <ErrorText>{report.error}</ErrorText>
      ) : (
        report.value.patterns.length > 0 && (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <PathList title={t.matched} tone="success" paths={report.value.matched} />
              <PathList title={t.unmatched} tone="danger" paths={report.value.unmatched} />
            </div>
            <Pane title={t.regex}>
              <div className="px-4 py-1.5">
                {report.value.patterns.map(({ pattern, negated, regex }) => (
                  <ValueRow key={`${negated}${pattern}`} label={`${negated ? "!" : ""}${pattern}`} value={regex} />
                ))}
              </div>
            </Pane>
          </>
        )
      )}
    </div>
  )
}

type TextPanelProps = { title: string; hint?: string; value: string; onChange: (value: string) => void }

function TextPanel({ title, hint, value, onChange }: TextPanelProps) {
  return (
    <GlassPanel variant="solid" className="flex flex-col gap-2 p-4">
      <h2 className="text-sm font-medium text-ink-soft">{title}</h2>
      <GlassTextarea
        aria-label={title}
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="font-mono"
      />
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </GlassPanel>
  )
}

function PathList({ title, tone, paths }: { title: string; tone: "success" | "danger"; paths: string[] }) {
  return (
    <Pane title={title} action={<Badge tone={tone}>{paths.length}</Badge>} className="min-h-32">
      <ul className="px-4 py-2 font-mono text-sm">
        {paths.map((path, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the same path may be listed twice
          <li key={index} className="py-0.5 break-all">
            {path}
          </li>
        ))}
      </ul>
    </Pane>
  )
}

import { type ReactNode, useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import type { Result } from "@/lib/result"
import { FLAGS, type RegexMatch, type RegexResult } from "./logic"
import { messages } from "./messages"
import { runInWorker } from "./runner"

const DEBOUNCE_MS = 150

const SAMPLE_TEXT = "Contact jane@example.com or team@gulatools.dev\nold address: admin@example.co.uk"

const isNullableString = (value: unknown) => value === null || typeof value === "string"

export default function RegexTool() {
  const t = useMessages(messages)
  const [pattern, setPattern] = usePersistentState("pattern", "(?<user>[\\w.]+)@(?<domain>[\\w.]+)")
  const [flags, setFlags] = usePersistentState("flags", "g")
  const [text, setText] = usePersistentState("text", SAMPLE_TEXT)
  const [replacement, setReplacement] = usePersistentState<string | null>("replacement", null, isNullableString)
  const [result, setResult] = useState<Result<RegexResult> | null>(null)

  useEffect(() => {
    if (!pattern) {
      setResult(null)
      return
    }
    let cancel = () => {}
    const timer = window.setTimeout(() => {
      const job = runInWorker({ pattern, flags, text, replacement })
      cancel = job.cancel
      job.result.then(setResult)
    }, DEBOUNCE_MS)
    return () => {
      window.clearTimeout(timer)
      cancel()
    }
  }, [pattern, flags, text, replacement])

  const toggleFlag = (flag: string, on: boolean) =>
    setFlags((current) => (on ? current + flag : current.replace(flag, "")))

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2 font-mono text-ink-soft">
          /
          <GlassInput
            aria-label={t.pattern}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            className="font-mono"
          />
          /{flags}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {FLAGS.map((flag) => (
            <Checkbox
              key={flag}
              label={`${flag} · ${t.flags[flag]}`}
              checked={flags.includes(flag)}
              onChange={(on) => toggleFlag(flag, on)}
            />
          ))}
          <Checkbox label="Replace" checked={replacement !== null} onChange={(on) => setReplacement(on ? "" : null)} />
        </div>
        {replacement !== null && (
          <GlassInput
            aria-label={t.replacement}
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder={t.replacementPlaceholder}
            spellCheck={false}
            className="font-mono"
          />
        )}
      </GlassPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassPanel variant="solid" className="flex flex-col gap-2 p-4">
          <h2 className="text-sm font-medium text-ink-soft">{t.testText}</h2>
          <GlassTextarea
            aria-label={t.testText}
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="font-mono"
          />
        </GlassPanel>

        <Pane
          title={t.result}
          action={result?.ok && <Badge>{t.matches(result.value.matches.length, result.value.truncated)}</Badge>}
          className="min-h-72"
        >
          {result &&
            (result.ok ? (
              <Matches text={text} result={result.value} />
            ) : (
              <ErrorText className="p-4 font-mono">{result.error}</ErrorText>
            ))}
        </Pane>
      </div>
    </div>
  )
}

function Matches({ text, result }: { text: string; result: RegexResult }) {
  const t = useMessages(messages)
  return (
    <div className="flex flex-col gap-4 p-4">
      <pre className="font-mono text-sm break-all whitespace-pre-wrap">
        <Highlighted text={text} matches={result.matches} />
      </pre>

      {result.replaced !== null && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink-soft">{t.replaced}</h3>
            <CopyButton text={result.replaced} />
          </div>
          <pre className="rounded-glass-sm bg-black/5 p-3 font-mono text-sm break-all whitespace-pre-wrap dark:bg-white/5">
            {result.replaced}
          </pre>
        </div>
      )}

      <ol className="flex flex-col gap-2">
        {result.matches.map((match, i) => (
          <MatchRow key={match.index} number={i + 1} match={match} />
        ))}
      </ol>
    </div>
  )
}

function MatchRow({ number, match }: { number: number; match: RegexMatch }) {
  const t = useMessages(messages)
  const groups = [...match.groups.map((value, i) => [`$${i + 1}`, value] as const), ...Object.entries(match.named)]
  return (
    <li className="rounded-glass-sm bg-black/5 px-3 py-2 font-mono text-xs dark:bg-white/5">
      <div className="flex gap-3">
        <span className="text-ink-soft">#{number}</span>
        <span className="text-ink-soft">@{match.index}</span>
        <span className="break-all">{match.text || t.empty}</span>
      </div>
      {groups.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-4 text-ink-soft">
          {groups.map(([name, value]) => (
            <span key={name}>
              {name}: <span className="text-ink">{value ?? "—"}</span>
            </span>
          ))}
        </div>
      )}
    </li>
  )
}

function Highlighted({ text, matches }: { text: string; matches: RegexMatch[] }) {
  const parts: ReactNode[] = []
  let cursor = 0
  for (const match of matches) {
    if (!match.text) continue
    parts.push(text.slice(cursor, match.index))
    parts.push(
      <mark key={match.index} className="rounded-sm bg-focus/30 text-ink">
        {match.text}
      </mark>,
    )
    cursor = match.index + match.text.length
  }
  parts.push(text.slice(cursor))
  return parts
}

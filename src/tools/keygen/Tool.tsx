import { KeyRound } from "lucide-react"
import { useEffect, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Dropdown } from "@/components/glass/Dropdown"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { isOption, oneOf, usePersistentState } from "@/lib/persist"
import { type Result, settle } from "@/lib/result"
import { useAsync } from "@/lib/use-async"
import { convertKey, generateKeys, KEY_TYPES, type KeyConversion, type KeyPairExport, type KeyType } from "./logic"
import { messages } from "./messages"

type Mode = "generate" | "convert"

const MODES = ["generate", "convert"] as const satisfies readonly Mode[]

const OUTPUTS = [
  { key: "publicPem", title: "Public key (PEM)" },
  { key: "privatePem", title: "Private key (PEM, PKCS#8)" },
  { key: "publicJwk", title: "Public key (JWK)" },
  { key: "privateJwk", title: "Private key (JWK)" },
] as const satisfies readonly { key: keyof KeyPairExport; title: string }[]

export default function KeygenTool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<Mode>("mode", "generate", oneOf(MODES))

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<Mode> label="Mode" value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />
      </GlassPanel>
      {mode === "generate" ? <GeneratePanel /> : <ConvertPanel />}
    </div>
  )
}

function OutputGrid({ outputs }: { outputs: readonly { title: string; value: string }[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {outputs.map(({ title, value }) => (
        <Pane key={title} title={title} action={<CopyButton text={value} />} className="max-h-96">
          <pre className="p-4 font-mono text-xs break-all whitespace-pre-wrap">{value}</pre>
        </Pane>
      ))}
    </div>
  )
}

function GeneratePanel() {
  const t = useMessages(messages)
  const [type, setType] = usePersistentState<KeyType>("type", "p256", isOption(KEY_TYPES))
  const task = useAsync(generateKeys)
  const keys = task.result?.ok ? task.result.value : null

  return (
    <>
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Dropdown<KeyType> label={t.keyType} value={type} options={KEY_TYPES} onChange={setType} />
        <GlassButton variant="key" onClick={() => task.run(type)} disabled={task.pending}>
          <KeyRound aria-hidden="true" className="size-4" />
          {task.pending ? t.generating : t.generate}
        </GlassButton>
        {keys && <span className="text-sm text-ink-soft">{t.jwtAlg(keys.alg)}</span>}
      </GlassPanel>

      {task.result && !task.result.ok && <ErrorText>{task.result.error}</ErrorText>}

      {keys && <OutputGrid outputs={OUTPUTS.map(({ key, title }) => ({ title, value: keys[key] }))} />}
    </>
  )
}

function ConvertPanel() {
  const t = useMessages(messages)
  const [input, setInput] = useState("")
  const [result, setResult] = useState<Result<KeyConversion> | null>(null)

  useEffect(() => {
    if (!input.trim()) {
      setResult(null)
      return
    }
    let live = true
    settle(() => convertKey(input)).then((next) => live && setResult(next))
    return () => {
      live = false
    }
  }, [input])

  return (
    <>
      <GlassPanel variant="solid" className="flex flex-col gap-2 p-4">
        <GlassTextarea
          aria-label={t.keyInput}
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.keyPlaceholder}
          spellCheck={false}
          className="font-mono text-xs"
        />
        <p className="text-xs text-ink-soft">{t.keyHint}</p>
      </GlassPanel>

      {result && !result.ok && <ErrorText>{result.error}</ErrorText>}

      {result?.ok && (
        <>
          <GlassPanel variant="solid" className="px-4 py-1.5">
            <ValueRow label={t.algorithm} value={result.value.alg} />
            <ValueRow label={t.thumbprint} value={result.value.thumbprint} />
          </GlassPanel>
          <OutputGrid outputs={result.value.outputs} />
        </>
      )}
    </>
  )
}

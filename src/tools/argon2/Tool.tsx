import { wrap } from "comlink"
import { CircleCheck, CircleX } from "lucide-react"
import { type FormEvent, useState } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { RangeField } from "@/components/RangeField"
import { ValueRow } from "@/components/ValueRow"
import { useLocale, useMessages } from "@/i18n/locale"
import { attempt } from "@/lib/result"
import { useAsync } from "@/lib/use-async"
import { type Argon2Params, type Argon2Variant, parseArgon2, type ScryptParams } from "./logic"
import { messages } from "./messages"
import type { KdfApi } from "./worker"

const kdf = wrap<KdfApi>(new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }))

type Algorithm = Argon2Variant | "scrypt"

const ALGORITHMS = [
  { value: "argon2id", label: "Argon2id" },
  { value: "argon2i", label: "Argon2i" },
  { value: "argon2d", label: "Argon2d" },
  { value: "scrypt", label: "scrypt" },
] as const satisfies readonly SegmentedOption<Algorithm>[]

type HashResult = { lines: { label: string; value: string }[]; ms: number }

export default function KdfTool() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <HashPanel />
      <VerifyPanel />
    </div>
  )
}

function HashPanel() {
  const locale = useLocale()
  const t = messages[locale]
  const [algorithm, setAlgorithm] = useState<Algorithm>("argon2id")
  const [password, setPassword] = useState("")
  const [argon, setArgon] = useState<Argon2Params>({ iterations: 3, memoryMiB: 64, parallelism: 1 })
  const [scrypt, setScrypt] = useState<ScryptParams>({ costLog2: 15, blockSize: 8, parallelism: 1 })

  const task = useAsync(async (): Promise<HashResult> => {
    if (algorithm === "scrypt") {
      const { value, ms } = await kdf.scrypt(password, scrypt)
      return {
        lines: [
          { label: "Hash (hex)", value: value.hash },
          { label: "Salt (hex)", value: value.salt },
        ],
        ms,
      }
    }
    const { value, ms } = await kdf.argon2(algorithm, password, argon)
    return { lines: [{ label: "Hash", value }], ms }
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    task.run()
  }

  return (
    <GlassPanel variant="solid" className="p-5">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <h2 className="font-medium">{t.createHash}</h2>
        <Segmented<Algorithm>
          label={t.algorithm}
          value={algorithm}
          options={ALGORITHMS}
          onChange={(next) => {
            setAlgorithm(next)
            task.reset()
          }}
        />
        <Field label="Password">
          {(id) => (
            <GlassInput
              id={id}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </Field>
        {algorithm === "scrypt" ? (
          <RangeField
            label="Cost (N)"
            value={scrypt.costLog2}
            min={10}
            max={20}
            format={(log2) => `2^${log2} = ${(2 ** log2).toLocaleString(locale)}`}
            hint={t.scryptHint}
            onChange={(costLog2) => setScrypt((s) => ({ ...s, costLog2 }))}
          />
        ) : (
          <>
            <RangeField
              label={t.memory}
              value={argon.memoryMiB}
              min={8}
              max={256}
              step={8}
              format={(mib) => `${mib} MiB`}
              hint={t.memoryHint}
              onChange={(memoryMiB) => setArgon((a) => ({ ...a, memoryMiB }))}
            />
            <RangeField
              label={t.iterations}
              value={argon.iterations}
              min={1}
              max={10}
              onChange={(iterations) => setArgon((a) => ({ ...a, iterations }))}
            />
            <RangeField
              label={t.parallelism}
              value={argon.parallelism}
              min={1}
              max={4}
              onChange={(parallelism) => setArgon((a) => ({ ...a, parallelism }))}
            />
          </>
        )}
        <GlassButton type="submit" variant="key" disabled={task.pending} className="self-start">
          {task.pending ? t.hashing : t.generate}
        </GlassButton>
        {task.result &&
          (task.result.ok ? (
            <div>
              {task.result.value.lines.map((line) => (
                <ValueRow key={line.label} label={line.label} value={line.value} />
              ))}
              <p className="mt-2 text-xs text-ink-soft">{t.doneIn(task.result.value.ms / 1000)}</p>
            </div>
          ) : (
            <ErrorText>{task.result.error}</ErrorText>
          ))}
      </form>
    </GlassPanel>
  )
}

function VerifyPanel() {
  const [password, setPassword] = useState("")
  const [hash, setHash] = useState("")
  const t = useMessages(messages)
  const task = useAsync(kdf.verify)
  const info = hash.trim() ? attempt(() => parseArgon2(hash)) : null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (info?.ok) task.run(password, hash)
  }

  return (
    <GlassPanel variant="solid" className="p-5">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <h2 className="font-medium">{t.verify}</h2>
        <Field label="Password">
          {(id) => (
            <GlassInput
              id={id}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                task.reset()
              }}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </Field>
        <Field
          label="Hash"
          hint={info && (info.ok ? t.hashInfo(info.value) : <span className="text-danger">{info.error}</span>)}
        >
          {(id) => (
            <GlassInput
              id={id}
              value={hash}
              onChange={(e) => {
                setHash(e.target.value)
                task.reset()
              }}
              placeholder="$argon2id$v=19$m=65536,t=3,p=1$…"
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
        <GlassButton type="submit" variant="key" disabled={task.pending || !info?.ok} className="self-start">
          {task.pending ? t.checking : t.check}
        </GlassButton>
        {task.result && (
          <div role="status">
            {task.result.ok ? (
              <Badge tone={task.result.value ? "success" : "danger"} icon={task.result.value ? CircleCheck : CircleX}>
                {task.result.value ? t.match : t.mismatch}
              </Badge>
            ) : (
              <ErrorText>{task.result.error}</ErrorText>
            )}
          </div>
        )}
      </form>
    </GlassPanel>
  )
}

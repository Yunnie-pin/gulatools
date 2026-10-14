import { LockKeyhole, LockKeyholeOpen } from "lucide-react"
import { type FormEvent, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { useLocale } from "@/i18n/locale"
import { oneOf, usePersistentState } from "@/lib/persist"
import { useAsync } from "@/lib/use-async"
import { decryptText, encryptText, PBKDF2_ITERATIONS } from "./logic"
import { messages } from "./messages"

type Mode = "encrypt" | "decrypt"

const MODES = ["encrypt", "decrypt"] as const satisfies readonly Mode[]

const MODE_ICONS = { encrypt: LockKeyhole, decrypt: LockKeyholeOpen } as const

export default function AesTool() {
  const locale = useLocale()
  const t = messages[locale]
  const [mode, setMode] = usePersistentState<Mode>("mode", "encrypt", oneOf(MODES))
  const [input, setInput] = useState("")
  const [password, setPassword] = useState("")
  const task = useAsync((text: string, key: string) =>
    mode === "encrypt" ? encryptText(text, key) : decryptText(text, key),
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    task.run(input, password)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassPanel variant="solid" className="p-5">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Segmented<Mode>
            label="Mode"
            value={mode}
            options={MODES.map((value) => ({ value, label: t.modes[value], icon: MODE_ICONS[value] }))}
            onChange={(next) => {
              setMode(next)
              task.reset()
            }}
          />
          <Field label={mode === "encrypt" ? t.text : t.ciphertext}>
            {(id) => (
              <GlassTextarea
                id={id}
                rows={8}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={mode === "encrypt" ? "font-sans" : undefined}
              />
            )}
          </Field>
          <Field label="Password" hint={t.keyHint(PBKDF2_ITERATIONS.toLocaleString(locale))}>
            {(id) => (
              <GlassInput
                id={id}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            )}
          </Field>
          <GlassButton type="submit" variant="key" disabled={task.pending || !input} className="self-start">
            {task.pending ? t.processing : t.modes[mode]}
          </GlassButton>
        </form>
      </GlassPanel>

      <Pane
        title={t.results[mode]}
        className="min-h-60"
        action={task.result?.ok && <CopyButton text={task.result.value} />}
      >
        <div className="p-4">
          {!task.result && <p className="text-sm text-ink-soft">{t.formatHint}</p>}
          {task.result &&
            (task.result.ok ? (
              <p className="font-mono text-sm break-all whitespace-pre-wrap">{task.result.value}</p>
            ) : (
              <ErrorText>{task.result.error}</ErrorText>
            ))}
        </div>
      </Pane>
    </div>
  )
}

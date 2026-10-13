import { LockKeyhole, LockKeyholeOpen } from "lucide-react"
import { type FormEvent, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { useAsync } from "@/lib/use-async"
import { decryptText, encryptText, PBKDF2_ITERATIONS } from "./logic"

type Mode = "encrypt" | "decrypt"

const MODES = [
  { value: "encrypt", label: "Enkripsi", icon: LockKeyhole },
  { value: "decrypt", label: "Dekripsi", icon: LockKeyholeOpen },
] as const satisfies readonly SegmentedOption<Mode>[]

export default function AesTool() {
  const [mode, setMode] = useState<Mode>("encrypt")
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
            options={MODES}
            onChange={(next) => {
              setMode(next)
              task.reset()
            }}
          />
          <Field label={mode === "encrypt" ? "Teks" : "Data terenkripsi (Base64)"}>
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
          <Field
            label="Password"
            hint={`Kunci AES-256 diturunkan dengan PBKDF2-SHA256, ${PBKDF2_ITERATIONS.toLocaleString("id")} iterasi.`}
          >
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
            {task.pending ? "Memproses…" : mode === "encrypt" ? "Enkripsi" : "Dekripsi"}
          </GlassButton>
        </form>
      </GlassPanel>

      <Pane
        title={mode === "encrypt" ? "Hasil enkripsi" : "Hasil dekripsi"}
        className="min-h-60"
        action={task.result?.ok && <CopyButton text={task.result.value} />}
      >
        <div className="p-4">
          {!task.result && (
            <p className="text-sm text-ink-soft">
              Format hasil: Base64 dari salt (16 byte) + IV (12 byte) + ciphertext AES-GCM.
            </p>
          )}
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

import { wrap } from "comlink"
import { CircleCheck, CircleX } from "lucide-react"
import { type FormEvent, useState } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { RangeField } from "@/components/RangeField"
import { ValueRow } from "@/components/ValueRow"
import { attempt } from "@/lib/result"
import { useAsync } from "@/lib/use-async"
import { MAX_COST, MAX_PASSWORD_BYTES, MIN_COST, parseBcryptHash, passwordBytes } from "./logic"
import type { BcryptApi } from "./worker"

const bcrypt = wrap<BcryptApi>(new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }))

export default function BcryptTool() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <HashPanel />
      <VerifyPanel />
    </div>
  )
}

function TooLongHint({ password }: { password: string }) {
  if (passwordBytes(password) <= MAX_PASSWORD_BYTES) return null
  return <span className="text-danger">Lebih dari 72 byte. Bcrypt hanya memakai 72 byte pertama.</span>
}

function HashPanel() {
  const [password, setPassword] = useState("")
  const [cost, setCost] = useState(10)
  const task = useAsync(bcrypt.hash)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    task.run(password, cost)
  }

  return (
    <GlassPanel variant="solid" className="p-5">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <h2 className="font-medium">Buat hash</h2>
        <Field label="Password" hint={<TooLongHint password={password} />}>
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
        <RangeField
          label="Cost factor"
          value={cost}
          min={MIN_COST}
          max={MAX_COST}
          hint="Setiap +1 membuat hashing dua kali lebih lama. 10–12 umum dipakai."
          onChange={setCost}
        />
        <GlassButton type="submit" variant="key" disabled={task.pending} className="self-start">
          {task.pending ? "Menghitung…" : "Generate hash"}
        </GlassButton>
        {task.result &&
          (task.result.ok ? (
            <div>
              <ValueRow label="Hash" value={task.result.value.hash} />
              <p className="mt-2 text-xs text-ink-soft">
                Selesai dalam {(task.result.value.ms / 1000).toFixed(2)} detik
              </p>
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
  const task = useAsync(bcrypt.compare)
  const info = hash.trim() ? attempt(() => parseBcryptHash(hash)) : null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (info?.ok) task.run(password, hash.trim())
  }

  return (
    <GlassPanel variant="solid" className="p-5">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <h2 className="font-medium">Verifikasi</h2>
        <Field label="Password" hint={<TooLongHint password={password} />}>
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
          hint={
            info &&
            (info.ok ? (
              `Versi $${info.value.version}$ · cost ${info.value.cost} · salt ${info.value.salt}`
            ) : (
              <span className="text-danger">{info.error}</span>
            ))
          }
        >
          {(id) => (
            <GlassInput
              id={id}
              value={hash}
              onChange={(e) => {
                setHash(e.target.value)
                task.reset()
              }}
              placeholder="$2b$10$…"
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
        <GlassButton type="submit" variant="key" disabled={task.pending || !info?.ok} className="self-start">
          {task.pending ? "Memeriksa…" : "Cek kecocokan"}
        </GlassButton>
        {task.result && (
          <div role="status">
            {task.result.ok ? (
              <Badge tone={task.result.value ? "success" : "danger"} icon={task.result.value ? CircleCheck : CircleX}>
                {task.result.value ? "Password cocok" : "Password tidak cocok"}
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

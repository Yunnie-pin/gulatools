import { json } from "@codemirror/lang-json"
import { useEffect, useMemo, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { Checkbox } from "@/components/glass/Checkbox"
import { Dropdown } from "@/components/glass/Dropdown"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { oneOf, usePersistentState } from "@/lib/persist"
import { type Result, settle } from "@/lib/result"
import { isHmac, SIGN_ALGORITHMS, type SignAlgorithm, type SignOptions, signToken } from "./logic"
import { messages } from "./messages"

const language = json()

const ALGORITHM_OPTIONS = SIGN_ALGORITHMS.map((value) => ({ value, label: value }))

type Settings = Pick<SignOptions, "alg" | "expiresIn" | "issuedAt">

type Secrets = Pick<SignOptions, "payload" | "key">

const INITIAL_SETTINGS: Settings = { alg: "HS256", expiresIn: "1h", issuedAt: true }

const INITIAL_SECRETS: Secrets = {
  payload: JSON.stringify({ sub: "1234567890", name: "Gula Manis", role: "admin" }, null, 2),
  key: "",
}

const isSettings = (settings: Settings) => oneOf(SIGN_ALGORITHMS)(settings.alg)

export function JwtSign() {
  const t = useMessages(messages)
  // Hanya pengaturan yang disimpan; payload dan key tidak pernah ditulis ke localStorage.
  const [settings, setSettings] = usePersistentState("signSettings", INITIAL_SETTINGS, isSettings)
  const [secrets, setSecrets] = useState(INITIAL_SECRETS)
  const options = useMemo<SignOptions>(() => ({ ...settings, ...secrets }), [settings, secrets])
  const [token, setToken] = useState<Result<string> | null>(null)
  const set = ({ payload, key, ...rest }: Partial<SignOptions>) => {
    if (payload !== undefined || key !== undefined) {
      setSecrets((current) => ({ payload: payload ?? current.payload, key: key ?? current.key }))
    }
    if (Object.keys(rest).length) setSettings((current) => ({ ...current, ...rest }))
  }
  const hmac = isHmac(options.alg)

  useEffect(() => {
    if (!options.key) {
      setToken(null)
      return
    }
    let live = true
    settle(() => signToken(options)).then((next) => live && setToken(next))
    return () => {
      live = false
    }
  }, [options])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Pane title="Payload" className="h-72">
          <Editor
            label="Payload"
            value={options.payload}
            onChange={(payload) => set({ payload })}
            language={language}
          />
        </Pane>
        <GlassPanel variant="solid" className="flex flex-col gap-4 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown<SignAlgorithm>
              label={t.algorithm}
              value={options.alg}
              options={ALGORITHM_OPTIONS}
              onChange={(alg) => set({ alg })}
            />
            <GlassInput
              aria-label={t.expiresIn}
              title={t.expiresInHint}
              value={options.expiresIn}
              onChange={(e) => set({ expiresIn: e.target.value })}
              placeholder="exp: 1h"
              className="h-9 w-28 font-mono"
            />
            <Checkbox label={t.includeIat} checked={options.issuedAt} onChange={(issuedAt) => set({ issuedAt })} />
          </div>
          <Field label={hmac ? "Secret" : t.privateKey} hint={t.keyHint}>
            {(id) =>
              hmac ? (
                <GlassInput
                  id={id}
                  value={options.key}
                  onChange={(e) => set({ key: e.target.value })}
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono"
                />
              ) : (
                <GlassTextarea
                  id={id}
                  rows={6}
                  value={options.key}
                  onChange={(e) => set({ key: e.target.value })}
                  placeholder="-----BEGIN PRIVATE KEY-----"
                />
              )
            }
          </Field>
        </GlassPanel>
      </div>

      <Pane title="Token" className="min-h-60" action={token?.ok && <CopyButton text={token.value} />}>
        <div className="p-4 font-mono text-sm break-all">
          {!token && <p className="text-ink-soft">{t.emptyHint}</p>}
          {token && (token.ok ? token.value : <ErrorText className="font-sans">{token.error}</ErrorText>)}
        </div>
      </Pane>
    </div>
  )
}

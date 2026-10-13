import { json } from "@codemirror/lang-json"
import { useEffect, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { Checkbox } from "@/components/glass/Checkbox"
import { Dropdown } from "@/components/glass/Dropdown"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { type Result, settle } from "@/lib/result"
import { isHmac, SIGN_ALGORITHMS, type SignAlgorithm, type SignOptions, signToken } from "./logic"

const language = json()

const ALGORITHM_OPTIONS = SIGN_ALGORITHMS.map((value) => ({ value, label: value }))

const INITIAL: SignOptions = {
  alg: "HS256",
  payload: JSON.stringify({ sub: "1234567890", name: "Gula Manis", role: "admin" }, null, 2),
  key: "",
  expiresIn: "1h",
  issuedAt: true,
}

export function JwtSign() {
  const [options, setOptions] = useState(INITIAL)
  const [token, setToken] = useState<Result<string> | null>(null)
  const set = (next: Partial<SignOptions>) => setOptions((current) => ({ ...current, ...next }))
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
              label="Algoritma"
              value={options.alg}
              options={ALGORITHM_OPTIONS}
              onChange={(alg) => set({ alg })}
            />
            <GlassInput
              aria-label="Kedaluwarsa dalam"
              title="Kedaluwarsa dalam, misalnya 15m, 1h, 7d. Kosongkan untuk tanpa exp."
              value={options.expiresIn}
              onChange={(e) => set({ expiresIn: e.target.value })}
              placeholder="exp: 1h"
              className="h-9 w-28 font-mono"
            />
            <Checkbox label="Sertakan iat" checked={options.issuedAt} onChange={(issuedAt) => set({ issuedAt })} />
          </div>
          <Field
            label={hmac ? "Secret" : "Private key (PKCS#8 PEM atau JWK)"}
            hint="Kunci hanya dipakai di browser ini dan tidak disimpan."
          >
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
          {!token && <p className="text-ink-soft">Isi secret atau private key untuk membuat token.</p>}
          {token && (token.ok ? token.value : <ErrorText className="font-sans">{token.error}</ErrorText>)}
        </div>
      </Pane>
    </div>
  )
}

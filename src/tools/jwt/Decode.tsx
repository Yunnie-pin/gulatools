import { json } from "@codemirror/lang-json"
import { CircleCheck, CircleX } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { Editor } from "@/components/Editor"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { ValueRow } from "@/components/ValueRow"
import { useLocale, useMessages } from "@/i18n/locale"
import { attempt, errorMessage, type Result } from "@/lib/result"
import { formatDateTime, relativeTime } from "@/lib/time"
import { claimDate, decodeToken, isHmac, TIME_CLAIMS, tokenStatus, verifySignature } from "./logic"
import { messages } from "./messages"

const language = json()

const SAMPLE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmFuZSBEb2UiLCJyb2xlIjoiYWRtaW4iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzYwMDAwMDAwLCJleHAiOjQxMDI0NDQ4MDB9.Q5OtkU9Ha-WB2zZ1ZU0zoW8gEkgLdaTUy1aMumUw9bw"
const SAMPLE_SECRET = "sugar-secret"

const STATUS_TONES = { valid: "success", expired: "danger", "not-yet-valid": "danger" } as const

const pretty = (value: unknown) => JSON.stringify(value, null, 2)

export function JwtDecode() {
  const t = useMessages(messages)
  const [token, setToken] = useState("")
  const [key, setKey] = useState("")
  const [verification, setVerification] = useState<Result<boolean> | null>(null)

  const trimmed = token.trim()
  const decoded = useMemo(() => (trimmed ? attempt(() => decodeToken(trimmed)) : null), [trimmed])
  const jwt = decoded?.ok ? decoded.value : null
  const alg = jwt?.header.alg ?? ""
  const hmac = isHmac(alg)
  const status = jwt && tokenStatus(jwt.payload)

  useEffect(() => {
    if (!jwt || !key) {
      setVerification(null)
      return
    }
    let live = true
    verifySignature(trimmed, key).then(
      (value) => live && setVerification({ ok: true, value }),
      (error) => live && setVerification({ ok: false, error: errorMessage(error) }),
    )
    return () => {
      live = false
    }
  }, [jwt, trimmed, key])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-ink-soft">Token</h2>
            <div className="flex gap-2">
              <SampleButton
                onClick={() => {
                  setToken(SAMPLE_TOKEN)
                  setKey(SAMPLE_SECRET)
                }}
              />
              <ClearButton onClick={() => setToken("")} disabled={!token} />
            </div>
          </div>
          <GlassTextarea
            aria-label={t.tokenLabel}
            rows={7}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={t.tokenPlaceholder}
          />
          {decoded && !decoded.ok && <ErrorText>{decoded.error}</ErrorText>}
          {jwt && (
            <div className="flex flex-wrap gap-2">
              <Badge>{alg || t.noAlg}</Badge>
              {jwt.header.typ && <Badge>{jwt.header.typ}</Badge>}
              {status && <Badge tone={STATUS_TONES[status]}>{t.status[status]}</Badge>}
              {alg === "none" && <Badge tone="danger">{t.unsigned}</Badge>}
            </div>
          )}
        </GlassPanel>

        <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
          <h2 className="text-sm font-medium text-ink-soft">{t.verifySignature}</h2>
          <Field label={hmac || !alg ? "Secret" : t.publicKey} hint={t.keyHint}>
            {(id) =>
              hmac || !alg ? (
                <GlassInput
                  id={id}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono"
                />
              ) : (
                <GlassTextarea
                  id={id}
                  rows={6}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="-----BEGIN PUBLIC KEY-----"
                />
              )
            }
          </Field>
          {verification && (
            <div role="status">
              {verification.ok ? (
                <Badge
                  tone={verification.value ? "success" : "danger"}
                  icon={verification.value ? CircleCheck : CircleX}
                >
                  {verification.value ? t.signatureValid : t.signatureInvalid}
                </Badge>
              ) : (
                <ErrorText>{verification.error}</ErrorText>
              )}
            </div>
          )}
        </GlassPanel>
      </div>

      <div className="flex flex-col gap-4">
        <Pane title="Header" className="h-44">
          <Editor label="Header" value={jwt ? pretty(jwt.header) : ""} language={language} />
        </Pane>
        <Pane title="Payload" className="h-72">
          <Editor label="Payload" value={jwt ? pretty(jwt.payload) : ""} language={language} />
        </Pane>
        {jwt && <TimeClaims payload={jwt.payload} />}
      </div>
    </div>
  )
}

function TimeClaims({ payload }: { payload: Parameters<typeof claimDate>[0] }) {
  const locale = useLocale()
  const t = messages[locale]
  const rows = TIME_CLAIMS.flatMap((claim) => {
    const date = claimDate(payload, claim)
    return date ? [{ claim, date }] : []
  })
  if (!rows.length) return null

  return (
    <GlassPanel variant="solid" className="px-4 py-1.5">
      {rows.map(({ claim, date }) => (
        <ValueRow
          key={claim}
          label={`${t.claims[claim]} (${claim})`}
          value={`${formatDateTime(date, locale)} · ${relativeTime(date, locale)}`}
        />
      ))}
    </GlassPanel>
  )
}

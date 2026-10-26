import { KeyRound } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { LocalizedError } from "@/i18n/errors"
import { useMessages } from "@/i18n/locale"
import { qrMatrix } from "@/lib/qr"
import { attempt, type Result, settle } from "@/lib/result"
import {
  base32Decode,
  buildOtpauth,
  parseOtpauth,
  randomSecret,
  TOTP_ALGORITHMS,
  type TotpAlgorithm,
  type TotpCodes,
  type TotpConfig,
  totp,
} from "./logic"
import { messages } from "./messages"

const DIGITS = [
  { value: 6, label: "6" },
  { value: 8, label: "8" },
] as const

const PERIODS = [
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
] as const

const OTPAUTH = /^otpauth:/i

const groupDigits = (code: string) => code.replace(/(\d{3,4})(?=\d{3,4}$)/, "$1 ")

const INITIAL: TotpConfig = { secret: "", issuer: "", account: "", algorithm: "SHA-1", digits: 6, period: 30 }

export default function TotpTool() {
  const t = useMessages(messages)
  const [config, setConfig] = useState(INITIAL)
  const [now, setNow] = useState(Date.now)
  const [codes, setCodes] = useState<Result<TotpCodes> | null>(null)
  const set = (patch: Partial<TotpConfig>) => setConfig((current) => ({ ...current, ...patch }))

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const second = Math.floor(now / 1000)
  useEffect(() => {
    if (!config.secret.trim()) {
      setCodes(null)
      return
    }
    let live = true
    settle(() => {
      if (OTPAUTH.test(config.secret)) throw new LocalizedError("invalidOtpauth")
      return totp(config, second * 1000)
    }).then((next) => live && setCodes(next))
    return () => {
      live = false
    }
  }, [config, second])

  const qr = useMemo(
    () =>
      attempt(() => {
        base32Decode(config.secret)
        return qrMatrix(buildOtpauth(config), "M")
      }),
    [config],
  )

  const changeSecret = (value: string) => {
    const parsed = OTPAUTH.test(value) ? attempt(() => parseOtpauth(value)) : null
    setConfig((current) => (parsed?.ok ? parsed.value : { ...current, secret: value }))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Field label={t.secret} hint={t.secretHint}>
          {(id) => (
            <div className="flex gap-2">
              <GlassInput
                id={id}
                value={config.secret}
                onChange={(e) => changeSecret(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="JBSWY3DPEHPK3PXP"
                className="min-w-0 flex-1 font-mono"
              />
              <GlassButton onClick={() => set({ secret: randomSecret() })}>
                <KeyRound aria-hidden="true" className="size-4" />
                {t.generate}
              </GlassButton>
            </div>
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.issuer}>
            {(id) => <GlassInput id={id} value={config.issuer} onChange={(e) => set({ issuer: e.target.value })} />}
          </Field>
          <Field label={t.account}>
            {(id) => <GlassInput id={id} value={config.account} onChange={(e) => set({ account: e.target.value })} />}
          </Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <Segmented<TotpAlgorithm>
            label={t.algorithm}
            value={config.algorithm}
            options={TOTP_ALGORITHMS}
            onChange={(algorithm) => set({ algorithm })}
          />
          <Segmented<number>
            label={t.digits}
            value={config.digits}
            options={DIGITS}
            onChange={(digits) => set({ digits })}
          />
          <Segmented<number>
            label={t.period}
            value={config.period}
            options={PERIODS}
            onChange={(period) => set({ period })}
          />
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col items-center gap-4 p-5 text-center">
        {!codes ? (
          <p className="my-auto text-sm text-ink-soft">{t.empty}</p>
        ) : codes.ok ? (
          <>
            <div className="flex items-center gap-2">
              <output aria-label={t.currentCode} className="font-mono text-4xl font-semibold tracking-wider">
                {groupDigits(codes.value.current)}
              </output>
              <CopyButton text={codes.value.current} />
            </div>
            <div className="w-full max-w-60">
              <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-ink transition-[width] duration-1000 ease-linear"
                  style={{ width: `${(codes.value.remaining / config.period) * 100}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-soft">{t.remaining(codes.value.remaining)}</p>
            </div>
            <p className="text-sm text-ink-soft">
              {t.next}: <span className="font-mono text-ink">{groupDigits(codes.value.next)}</span>
            </p>
            {qr.ok && (
              <svg
                role="img"
                aria-label={t.qrLabel}
                viewBox={`-2 -2 ${qr.value.size + 4} ${qr.value.size + 4}`}
                shapeRendering="crispEdges"
                className="aspect-square w-full max-w-56 rounded-glass-sm bg-white"
              >
                <path d={qr.value.path} fill="#000" />
              </svg>
            )}
          </>
        ) : (
          <ErrorText className="my-auto">{codes.error}</ErrorText>
        )}
      </GlassPanel>
    </div>
  )
}

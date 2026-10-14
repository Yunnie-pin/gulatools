import { useEffect, useState } from "react"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { type Result, settle } from "@/lib/result"
import { HMAC_ALGORITHMS, type HmacAlgorithm, type HmacDigest, hmac } from "./logic"
import { messages } from "./messages"

export default function HmacTool() {
  const t = useMessages(messages)
  const [message, setMessage] = useState("")
  const [key, setKey] = useState("")
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA-256")
  const [digest, setDigest] = useState<Result<HmacDigest> | null>(null)

  useEffect(() => {
    if (!key) {
      setDigest(null)
      return
    }
    let live = true
    settle(() => hmac(message, key, algorithm)).then((next) => live && setDigest(next))
    return () => {
      live = false
    }
  }, [message, key, algorithm])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Segmented<HmacAlgorithm>
          label={t.algorithm}
          value={algorithm}
          options={HMAC_ALGORITHMS}
          onChange={setAlgorithm}
        />
        <Field label={t.message}>
          {(id) => (
            <GlassTextarea
              id={id}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-sans"
            />
          )}
        </Field>
        <Field label={t.secret} hint={t.secretHint}>
          {(id) => (
            <GlassInput
              id={id}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
      </GlassPanel>

      {digest && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          {digest.ok ? (
            <>
              <ValueRow label="Hex" value={digest.value.hex} />
              <ValueRow label="Base64" value={digest.value.base64} />
            </>
          ) : (
            <ErrorText className="py-3">{digest.error}</ErrorText>
          )}
        </GlassPanel>
      )}
    </div>
  )
}

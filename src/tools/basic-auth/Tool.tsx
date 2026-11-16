import { useMemo, useState } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { attempt } from "@/lib/result"
import { basicAuth } from "./logic"
import { messages } from "./messages"

export default function BasicAuthTool() {
  const t = useMessages(messages)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const result = useMemo(
    () => (username || password ? attempt(() => basicAuth(username, password)) : null),
    [username, password],
  )

  const fill = (nextUsername: string, nextPassword: string) => {
    setUsername(nextUsername)
    setPassword(nextPassword)
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex justify-end gap-2 px-4 py-3">
        <SampleButton onClick={() => fill("Aladdin", "open sesame")} />
        <ClearButton onClick={() => fill("", "")} disabled={!username && !password} />
      </GlassPanel>
      <GlassPanel variant="solid" className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label={t.username}>
          {(id) => (
            <GlassInput
              id={id}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
        <Field label={t.password}>
          {(id) => (
            <GlassInput
              id={id}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
      </GlassPanel>

      <GlassPanel variant="solid" className="px-4 py-1.5">
        {!result && <p className="py-2.5 text-sm text-ink-soft">{t.empty}</p>}
        {result &&
          (result.ok ? (
            <>
              <ValueRow label="Header" value={result.value.header} />
              <ValueRow label="Base64" value={result.value.token} />
              <ValueRow label="cURL" value={result.value.curl} />
            </>
          ) : (
            <ErrorText className="py-2.5">{result.error}</ErrorText>
          ))}
      </GlassPanel>
      <p className="text-xs text-ink-soft">{t.utf8Hint}</p>
    </div>
  )
}

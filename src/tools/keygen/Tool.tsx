import { KeyRound } from "lucide-react"

import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Dropdown } from "@/components/glass/Dropdown"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { isOption, usePersistentState } from "@/lib/persist"
import { useAsync } from "@/lib/use-async"
import { generateKeys, KEY_TYPES, type KeyPairExport, type KeyType } from "./logic"
import { messages } from "./messages"

const OUTPUTS = [
  { key: "publicPem", title: "Public key (PEM)" },
  { key: "privatePem", title: "Private key (PEM, PKCS#8)" },
  { key: "publicJwk", title: "Public key (JWK)" },
  { key: "privateJwk", title: "Private key (JWK)" },
] as const satisfies readonly { key: keyof KeyPairExport; title: string }[]

export default function KeygenTool() {
  const t = useMessages(messages)
  const [type, setType] = usePersistentState<KeyType>("type", "p256", isOption(KEY_TYPES))
  const task = useAsync(generateKeys)
  const keys = task.result?.ok ? task.result.value : null

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Dropdown<KeyType> label={t.keyType} value={type} options={KEY_TYPES} onChange={setType} />
        <GlassButton variant="key" onClick={() => task.run(type)} disabled={task.pending}>
          <KeyRound aria-hidden="true" className="size-4" />
          {task.pending ? t.generating : t.generate}
        </GlassButton>
        {keys && <span className="text-sm text-ink-soft">{t.jwtAlg(keys.alg)}</span>}
      </GlassPanel>

      {task.result && !task.result.ok && <ErrorText>{task.result.error}</ErrorText>}

      {keys && (
        <div className="grid gap-4 lg:grid-cols-2">
          {OUTPUTS.map(({ key, title }) => (
            <Pane key={key} title={title} action={<CopyButton text={keys[key]} />} className="max-h-96">
              <pre className="p-4 font-mono text-xs break-all whitespace-pre-wrap">{keys[key]}</pre>
            </Pane>
          ))}
        </div>
      )}
    </div>
  )
}

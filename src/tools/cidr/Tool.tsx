import { useMemo } from "react"
import { ErrorText } from "@/components/ErrorText"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { parseSubnet } from "./logic"
import { messages } from "./messages"

export default function CidrTool() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "192.168.1.0/24")
  const parsed = useMemo(() => attempt(() => parseSubnet(input)), [input])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <GlassInput
          aria-label={t.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className="font-mono"
        />
        {!parsed.ok && <ErrorText>{parsed.error}</ErrorText>}
      </GlassPanel>

      {parsed.ok && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          <ValueRow label={t.cidr} value={`${parsed.value.network}/${parsed.value.prefix}`} />
          <ValueRow label={t.netmask} value={parsed.value.netmask} />
          <ValueRow label={t.wildcard} value={parsed.value.wildcard} />
          <ValueRow label={t.broadcast} value={parsed.value.broadcast} />
          <ValueRow label={t.firstHost} value={parsed.value.firstHost} />
          <ValueRow label={t.lastHost} value={parsed.value.lastHost} />
          <ValueRow label={t.usableHosts} value={parsed.value.usableHosts.toLocaleString()} />
          <ValueRow label={t.totalAddresses} value={parsed.value.totalAddresses.toLocaleString()} />
          <ValueRow label={t.binaryNetmask} value={parsed.value.binaryNetmask} />
        </GlassPanel>
      )}
    </div>
  )
}

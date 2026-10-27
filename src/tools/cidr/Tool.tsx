import { useMemo } from "react"
import { ErrorText } from "@/components/ErrorText"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { type Ipv6Info, parseAnySubnet, type SubnetInfo } from "./logic"
import { messages } from "./messages"

export default function CidrTool() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "192.168.1.0/24")
  const parsed = useMemo(() => attempt(() => parseAnySubnet(input)), [input])

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
          {parsed.value.version === 4 ? <Ipv4Rows info={parsed.value.info} /> : <Ipv6Rows info={parsed.value.info} />}
        </GlassPanel>
      )}
    </div>
  )
}

function Ipv4Rows({ info }: { info: SubnetInfo }) {
  const t = useMessages(messages)
  return (
    <>
      <ValueRow label={t.cidr} value={`${info.network}/${info.prefix}`} />
      <ValueRow label={t.netmask} value={info.netmask} />
      <ValueRow label={t.wildcard} value={info.wildcard} />
      <ValueRow label={t.broadcast} value={info.broadcast} />
      <ValueRow label={t.firstHost} value={info.firstHost} />
      <ValueRow label={t.lastHost} value={info.lastHost} />
      <ValueRow label={t.usableHosts} value={info.usableHosts.toLocaleString()} />
      <ValueRow label={t.totalAddresses} value={info.totalAddresses.toLocaleString()} />
      <ValueRow label={t.binaryNetmask} value={info.binaryNetmask} />
    </>
  )
}

function Ipv6Rows({ info }: { info: Ipv6Info }) {
  const t = useMessages(messages)
  return (
    <>
      <ValueRow label={t.cidr} value={info.network} />
      <ValueRow label={t.type} value={t.types[info.type]} />
      <ValueRow label={t.address} value={info.address} />
      <ValueRow label={t.expanded} value={info.expanded} />
      <ValueRow label={t.firstAddress} value={info.firstAddress} />
      <ValueRow label={t.lastAddress} value={info.lastAddress} />
      <ValueRow label={t.totalAddresses} value={`2^${128 - info.prefix} = ${info.totalAddresses.toLocaleString()}`} />
      {info.subnets64 !== null && <ValueRow label={t.subnets64} value={info.subnets64.toLocaleString()} />}
      <ValueRow label={t.reverseDns} value={info.reverseDns} />
    </>
  )
}

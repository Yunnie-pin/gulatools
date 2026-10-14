import { useMemo } from "react"
import { ErrorText } from "@/components/ErrorText"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { oneOf, usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { BASES, type Base, parseNumber, twosComplement } from "./logic"
import { messages } from "./messages"

const INPUT_BASES = BASES.map((base) => ({ value: base, label: String(base) }))

export default function NumberBaseTool() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "255")
  const [base, setBase] = usePersistentState<Base>("base", 10, oneOf(BASES))
  const parsed = useMemo(() => attempt(() => parseNumber(input, base)), [input, base])
  const complement = parsed.ok ? twosComplement(parsed.value) : null

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <GlassInput
            aria-label={t.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-w-48 flex-1 font-mono"
          />
          <Segmented<Base> label={t.inputBase} value={base} options={INPUT_BASES} onChange={setBase} />
        </div>
        {!parsed.ok && <ErrorText>{parsed.error}</ErrorText>}
      </GlassPanel>

      {parsed.ok && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          {BASES.map((radix) => (
            <ValueRow key={radix} label={t.bases[radix]} value={parsed.value.toString(radix)} />
          ))}
          {complement && (
            <>
              <ValueRow label={`${t.twosComplement(complement.width)} (2)`} value={complement.bits.toString(2)} />
              <ValueRow label={`${t.twosComplement(complement.width)} (16)`} value={complement.bits.toString(16)} />
            </>
          )}
        </GlassPanel>
      )}
    </div>
  )
}

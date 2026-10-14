import { useMemo } from "react"
import { ErrorText } from "@/components/ErrorText"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { ACTIONS, bitOf, CLASSES, parseMode, SPECIALS, specialBit, toOctal, toSymbolic } from "./logic"
import { messages } from "./messages"

const GROUP_CLASS = "flex flex-col gap-2 rounded-glass-sm bg-black/5 p-3 dark:bg-white/5"
const LEGEND_CLASS = "float-left mb-1 text-sm font-medium"

export default function ChmodTool() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "755")
  const parsed = useMemo(() => attempt(() => parseMode(input)), [input])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-4">
        <GlassInput
          aria-label={t.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className="font-mono"
        />
        {parsed.ok ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CLASSES.map((permissionClass) => (
              <fieldset key={permissionClass} className={GROUP_CLASS}>
                <legend className={LEGEND_CLASS}>{t.classes[permissionClass]}</legend>
                {ACTIONS.map((action) => {
                  const bit = bitOf(permissionClass, action)
                  return (
                    <Checkbox
                      key={action}
                      label={t.actions[action]}
                      checked={(parsed.value & bit) !== 0}
                      onChange={() => setInput(toOctal(parsed.value ^ bit))}
                    />
                  )
                })}
              </fieldset>
            ))}
            <fieldset className={GROUP_CLASS}>
              <legend className={LEGEND_CLASS}>{t.specials}</legend>
              {SPECIALS.map((special) => (
                <Checkbox
                  key={special}
                  label={special}
                  checked={(parsed.value & specialBit(special)) !== 0}
                  onChange={() => setInput(toOctal(parsed.value ^ specialBit(special)))}
                />
              ))}
            </fieldset>
          </div>
        ) : (
          <ErrorText>{parsed.error}</ErrorText>
        )}
      </GlassPanel>

      {parsed.ok && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          <ValueRow label={t.octal} value={toOctal(parsed.value)} />
          <ValueRow label={t.symbolic} value={toSymbolic(parsed.value)} />
          <ValueRow label={t.command} value={`chmod ${toOctal(parsed.value)} file`} />
        </GlassPanel>
      )}
    </div>
  )
}

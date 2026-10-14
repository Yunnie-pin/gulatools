import { useState } from "react"
import { RegenerateButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { RangeField } from "@/components/RangeField"
import { useMessages } from "@/i18n/locale"
import { inRange, usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import {
  CHARSET_IDS,
  entropyBits,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  type PasswordOptions,
  strength,
} from "./logic"
import { messages } from "./messages"

const INITIAL: PasswordOptions = {
  length: 20,
  sets: { lower: true, upper: true, digits: true, symbols: true },
  excludeAmbiguous: false,
}

const isPasswordOptions = (options: PasswordOptions) => inRange(MIN_LENGTH, MAX_LENGTH)(options.length)

export default function PasswordTool() {
  const t = useMessages(messages)
  const [options, setOptions] = usePersistentState("options", INITIAL, isPasswordOptions)
  const [password, setPassword] = useState(() => attempt(() => generatePassword(options)))

  const update = (next: Partial<PasswordOptions>) => {
    const merged = { ...options, ...next }
    setOptions(merged)
    setPassword(attempt(() => generatePassword(merged)))
  }

  const bits = entropyBits(options)
  const rating = strength(bits)

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <output className="min-h-14 rounded-glass-md bg-black/5 px-4 py-3 font-mono text-xl break-all dark:bg-white/5">
          {password.ok ? password.value : <ErrorText>{password.error}</ErrorText>}
        </output>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={rating.tone}>{t.strength[rating.level]}</Badge>
          <Badge>{t.entropy(Math.round(bits))}</Badge>
          <div className="ml-auto flex gap-2">
            <RegenerateButton onClick={() => update({})} />
            <CopyButton text={password.ok ? password.value : ""} />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <RangeField
          label={t.length}
          value={options.length}
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          format={t.characters}
          onChange={(length) => update({ length })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {CHARSET_IDS.map((id) => (
            <Checkbox
              key={id}
              label={t.charsets[id]}
              checked={options.sets[id]}
              onChange={(on) => update({ sets: { ...options.sets, [id]: on } })}
            />
          ))}
          <Checkbox
            label={t.excludeAmbiguous}
            checked={options.excludeAmbiguous}
            onChange={(excludeAmbiguous) => update({ excludeAmbiguous })}
          />
        </div>
      </GlassPanel>
    </div>
  )
}

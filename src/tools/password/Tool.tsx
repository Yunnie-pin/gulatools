import { useState } from "react"
import { RegenerateButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { attempt } from "@/lib/result"
import {
  CHARSET_IDS,
  CHARSETS,
  entropyBits,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  type PasswordOptions,
  strength,
} from "./logic"

const INITIAL: PasswordOptions = {
  length: 20,
  sets: { lower: true, upper: true, digits: true, symbols: true },
  excludeAmbiguous: false,
}

export default function PasswordTool() {
  const [options, setOptions] = useState(INITIAL)
  const [password, setPassword] = useState(() => attempt(() => generatePassword(INITIAL)))

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
          <Badge tone={rating.tone}>{rating.label}</Badge>
          <Badge>≈ {Math.round(bits)} bit entropi</Badge>
          <div className="ml-auto flex gap-2">
            <RegenerateButton onClick={() => update({})} />
            <CopyButton text={password.ok ? password.value : ""} />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Field label={`Panjang: ${options.length} karakter`}>
          {(id) => (
            <input
              id={id}
              type="range"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={options.length}
              onChange={(e) => update({ length: Number(e.target.value) })}
              className="accent-focus"
            />
          )}
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHARSET_IDS.map((id) => (
            <Checkbox
              key={id}
              label={CHARSETS[id].label}
              checked={options.sets[id]}
              onChange={(on) => update({ sets: { ...options.sets, [id]: on } })}
            />
          ))}
          <Checkbox
            label="Hindari karakter mirip (O 0 l 1 I |)"
            checked={options.excludeAmbiguous}
            onChange={(excludeAmbiguous) => update({ excludeAmbiguous })}
          />
        </div>
      </GlassPanel>
    </div>
  )
}

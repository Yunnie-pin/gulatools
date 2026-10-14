import { useMemo, useState } from "react"
import { RegenerateButton } from "@/components/ActionButtons"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { inRange, oneOf, usePersistentState } from "@/lib/persist"
import { rng } from "@/lib/random"
import { clampCount, generateLorem, type LoremOptions, type LoremUnit, MAX_COUNT, UNITS } from "./logic"
import { messages } from "./messages"

const INITIAL: LoremOptions = { unit: "paragraphs", count: 3, classic: true }

const isLoremOptions = (options: LoremOptions) =>
  oneOf(UNITS)(options.unit) && inRange(1, MAX_COUNT[options.unit])(options.count)

const newSeed = () => crypto.getRandomValues(new Uint32Array(1))[0] ?? 0

export default function LoremTool() {
  const t = useMessages(messages)
  const [options, setOptions] = usePersistentState("options", INITIAL, isLoremOptions)
  const [seed, setSeed] = useState(newSeed)
  const output = useMemo(() => generateLorem(options, rng(seed)), [options, seed])

  const update = (next: Partial<LoremOptions>) => {
    const merged = { ...options, ...next }
    setOptions({ ...merged, count: clampCount(merged.unit, merged.count) })
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<LoremUnit>
          label={t.unit}
          value={options.unit}
          options={labeled(UNITS, t.units)}
          onChange={(unit) => update({ unit })}
        />
        <GlassInput
          type="number"
          aria-label={t.count}
          title={t.count}
          min={1}
          max={MAX_COUNT[options.unit]}
          value={options.count}
          onChange={(e) => update({ count: Number(e.target.value) })}
          className="h-9 w-24"
        />
        <Checkbox label={t.classic} checked={options.classic} onChange={(classic) => update({ classic })} />
        <RegenerateButton onClick={() => setSeed(newSeed())} className="ml-auto" />
      </GlassPanel>

      <Pane title={t.result} action={<CopyButton text={output} />} className="min-h-[420px] flex-1">
        <Editor label={t.result} value={output} />
      </Pane>
    </div>
  )
}

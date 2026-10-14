import { useState } from "react"
import { RegenerateButton } from "@/components/ActionButtons"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"

import { generateIds, ID_KINDS, type IdKind, type IdOptions, MAX_COUNT } from "./logic"
import { messages } from "./messages"

const CASES = [
  { value: "lower", label: "abc" },
  { value: "upper", label: "ABC" },
] as const

const INITIAL: IdOptions = { kind: "uuid-v4", count: 10, uppercase: false }

export default function UuidTool() {
  const t = useMessages(messages)
  const [options, setOptions] = useState(INITIAL)
  const [ids, setIds] = useState(() => generateIds(INITIAL))
  const output = ids.join("\n")

  const update = (next: Partial<IdOptions>) => {
    const merged = { ...options, ...next }
    setOptions(merged)
    setIds(generateIds(merged))
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<IdKind>
          label={t.kind}
          value={options.kind}
          options={ID_KINDS}
          onChange={(kind) => update({ kind })}
        />
        <Segmented
          label={t.letterCase}
          value={options.uppercase ? "upper" : "lower"}
          options={CASES}
          onChange={(value) => update({ uppercase: value === "upper" })}
        />
        <GlassInput
          type="number"
          aria-label={t.count}
          title={t.count}
          min={1}
          max={MAX_COUNT}
          value={options.count}
          onChange={(e) => update({ count: Number(e.target.value) })}
          className="h-9 w-24"
        />
        <RegenerateButton onClick={() => update({})} className="ml-auto" />
      </GlassPanel>

      <Pane title={`${ids.length} ID`} action={<CopyButton text={output} />} className="min-h-[420px] flex-1">
        <Editor label={t.result} value={output} />
      </Pane>
    </div>
  )
}

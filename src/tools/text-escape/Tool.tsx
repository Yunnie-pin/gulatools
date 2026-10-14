import { useCallback } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { type EscapeMode, escapeText } from "./logic"
import { messages } from "./messages"

const MODES = ["json", "jsonUnescape", "regex", "shell", "sql"] as const satisfies readonly EscapeMode[]

const SAMPLES: Record<EscapeMode, string> = {
  json: 'Gula "manis"\nkopi\tpahit',
  jsonUnescape: 'Gula \\"manis\\"\\nkopi\\tpahit',
  regex: "harga: Rp5.000 (diskon?) [promo]",
  shell: "it's $HOME",
  sql: "Jum'at",
}

export default function TextEscapeTool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<EscapeMode>("mode", "json", oneOf(MODES))
  const transform = useCallback((input: string) => escapeText(input, mode), [mode])

  return (
    <TransformTool
      transform={transform}
      sample={SAMPLES[mode]}
      options={<Segmented<EscapeMode> label="Mode" value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />}
    />
  )
}

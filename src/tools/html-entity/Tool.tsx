import { useCallback } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { type EntityMode, transformEntities } from "./logic"
import { messages } from "./messages"

const MODES = ["encode", "encodeAll", "decode"] as const satisfies readonly EntityMode[]

export default function HtmlEntityTool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<EntityMode>("mode", "encode", oneOf(MODES))
  const transform = useCallback((input: string) => transformEntities(input, mode), [mode])

  return (
    <TransformTool
      transform={transform}
      sample={
        mode === "decode"
          ? "&lt;p&gt;Gula &amp; kopi &mdash; &copy; 2026 &#x1F36C;&lt;/p&gt;"
          : '<p class="note">Gula & kopi — © 2026</p>'
      }
      options={<Segmented<EntityMode> label="Mode" value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />}
    />
  )
}

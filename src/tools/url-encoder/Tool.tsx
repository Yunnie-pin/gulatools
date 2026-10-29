import { useCallback } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { transformUrl, type UrlMode } from "./logic"
import { messages } from "./messages"

const MODES = ["component", "uri", "decode"] as const satisfies readonly UrlMode[]

export default function UrlEncoder() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<UrlMode>("mode", "component", oneOf(MODES))
  const transform = useCallback((input: string) => transformUrl(input, mode), [mode])

  return (
    <TransformTool
      transform={transform}
      sample={mode === "decode" ? transformUrl(t.sample, "component") : t.sample}
      options={<Segmented<UrlMode> label="Mode" value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />}
    />
  )
}

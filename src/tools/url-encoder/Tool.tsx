import { useCallback, useState } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { transformUrl, type UrlMode } from "./logic"

const MODES = [
  { value: "component", label: "Encode komponen" },
  { value: "uri", label: "Encode URL utuh" },
  { value: "decode", label: "Decode" },
] as const satisfies readonly { value: UrlMode; label: string }[]

export default function UrlEncoder() {
  const [mode, setMode] = useState<UrlMode>("component")
  const transform = useCallback((input: string) => transformUrl(input, mode), [mode])

  return (
    <TransformTool
      transform={transform}
      sample={mode === "decode" ? "q%3Dgula%20manis%26lang%3Did" : "q=gula manis&lang=id"}
      options={<Segmented<UrlMode> label="Mode" value={mode} options={MODES} onChange={setMode} />}
    />
  )
}

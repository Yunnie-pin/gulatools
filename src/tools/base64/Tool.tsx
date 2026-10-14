import { useCallback, useState } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"

import { decodeBase64, encodeBase64 } from "./logic"
import { messages } from "./messages"

type Mode = "encode" | "decode"
type Variant = "standard" | "url"

const MODES = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
] as const satisfies readonly { value: Mode; label: string }[]

const VARIANTS = ["standard", "url"] as const satisfies readonly Variant[]

export default function Base64Tool() {
  const t = useMessages(messages)
  const [mode, setMode] = useState<Mode>("encode")
  const [variant, setVariant] = useState<Variant>("standard")

  const transform = useCallback(
    (input: string) => (mode === "encode" ? encodeBase64(input, variant === "url") : decodeBase64(input)),
    [mode, variant],
  )

  return (
    <TransformTool
      transform={transform}
      sample={mode === "encode" ? "Gula itu manis — ünïcödé" : "R3VsYSBpdHUgbWFuaXMg4oCUIMO8bsOvY8O2ZMOp"}
      options={
        <>
          <Segmented<Mode> label="Mode" value={mode} options={MODES} onChange={setMode} />
          {mode === "encode" && (
            <Segmented<Variant>
              label={t.variant}
              value={variant}
              options={labeled(VARIANTS, t.variants)}
              onChange={setVariant}
            />
          )}
        </>
      }
    />
  )
}

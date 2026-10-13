import { useState } from "react"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { JwtDecode } from "./Decode"
import { JwtSign } from "./Sign"

type Mode = "decode" | "sign"

const MODES = [
  { value: "decode", label: "Decode & verify" },
  { value: "sign", label: "Sign" },
] as const satisfies readonly { value: Mode; label: string }[]

export default function JwtTool() {
  const [mode, setMode] = useState<Mode>("decode")

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="px-4 py-3">
        <Segmented<Mode> label="Mode" value={mode} options={MODES} onChange={setMode} />
      </GlassPanel>
      {mode === "decode" ? <JwtDecode /> : <JwtSign />}
    </div>
  )
}

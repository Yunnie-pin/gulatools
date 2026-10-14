import { CircleCheck, CircleX } from "lucide-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { attempt } from "@/lib/result"
import { convertColor, WCAG_AA } from "./logic"
import { messages } from "./messages"

export default function ColorTool() {
  const t = useMessages(messages)
  const [input, setInput] = useState("#ff6b5e")
  const color = useMemo(() => attempt(() => convertColor(input)), [input])

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <GlassInput
            aria-label={t.color}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="font-mono"
          />
          <input
            type="color"
            aria-label={t.pick}
            value={color.ok ? color.value.hex : "#000000"}
            onChange={(e) => setInput(e.target.value)}
            className="h-10 w-12 shrink-0 cursor-pointer rounded-glass-sm bg-transparent"
          />
        </div>
        <div
          className="aspect-square w-full rounded-glass-md shadow-[inset_0_0_0_1px_rgba(0,0,0,.1)] [background:repeating-conic-gradient(#ccc_0_25%,#fff_0_50%)_0_0/16px_16px]"
          aria-hidden="true"
        >
          <div
            className="size-full rounded-glass-md"
            style={{ background: color.ok ? color.value.hex8 : "transparent" }}
          />
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="px-4 py-1.5">
        {color.ok ? (
          <>
            <ValueRow label="HEX" value={color.value.hex} />
            <ValueRow label="HEX + alpha" value={color.value.hex8} />
            <ValueRow label="RGB" value={color.value.rgb} />
            <ValueRow label="HSL" value={color.value.hsl} />
            <ValueRow label="OKLCH" value={color.value.oklch} />
            <div className="flex flex-wrap items-center gap-2 py-3">
              <span className="w-32 text-sm text-ink-soft">{t.contrast}</span>
              <ContrastBadge on={t.white} ratio={color.value.contrast.white} />
              <ContrastBadge on={t.black} ratio={color.value.contrast.black} />
            </div>
          </>
        ) : (
          <ErrorText className="py-3">{color.error}</ErrorText>
        )}
      </GlassPanel>
    </div>
  )
}

function ContrastBadge({ on, ratio }: { on: string; ratio: number }) {
  const passes = ratio >= WCAG_AA
  return (
    <Badge tone={passes ? "success" : "danger"} icon={passes ? CircleCheck : CircleX}>
      vs {on}: {ratio.toFixed(2)}:1 AA
    </Badge>
  )
}

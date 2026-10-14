import { useState } from "react"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"

import { CASES, convertCase } from "./logic"
import { messages } from "./messages"

export default function CaseConverter() {
  const t = useMessages(messages)
  const [text, setText] = useState("user profile id")

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="p-4">
        <GlassTextarea
          aria-label={t.text}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          className="font-sans"
        />
      </GlassPanel>
      <GlassPanel variant="solid" className="px-4 py-1.5">
        {CASES.map(({ id, label }) => (
          <ValueRow key={id} label={label} value={convertCase(text, id)} />
        ))}
      </GlassPanel>
    </div>
  )
}

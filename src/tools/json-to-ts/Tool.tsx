import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { useCallback, useState } from "react"
import { GlassInput } from "@/components/glass/GlassInput"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"

import { toTypeScript, toZod } from "./logic"
import { messages } from "./messages"

const jsonLanguage = json()
const tsLanguage = javascript({ typescript: true })

type Target = "typescript" | "zod"

const TARGETS = [
  { value: "typescript", label: "TypeScript" },
  { value: "zod", label: "Zod" },
] as const satisfies readonly SegmentedOption<Target>[]

const SAMPLE = JSON.stringify({
  id: 42,
  name: "GulaTools",
  active: true,
  tags: ["json", "jwt"],
  owner: { login: "gula", avatarUrl: null },
  releases: [
    { version: "1.0.0", date: "2026-10-13" },
    { version: "1.1.0", date: "2026-11-01", notes: "Fase 3" },
  ],
})

export default function JsonToTs() {
  const t = useMessages(messages)
  const [target, setTarget] = useState<Target>("typescript")
  const [rootName, setRootName] = useState("Root")

  const transform = useCallback(
    (input: string) => {
      const value: unknown = JSON.parse(input)
      return target === "typescript" ? toTypeScript(value, rootName) : toZod(value, rootName)
    },
    [target, rootName],
  )

  return (
    <TransformTool
      transform={transform}
      inputLanguage={jsonLanguage}
      outputLanguage={tsLanguage}
      sample={SAMPLE}
      accept=".json,application/json"
      outputFileName={target === "typescript" ? "types.ts" : "schema.ts"}
      options={
        <>
          <Segmented<Target> label="Target" value={target} options={TARGETS} onChange={setTarget} />
          <GlassInput
            aria-label={t.rootName}
            title={t.rootName}
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            spellCheck={false}
            className="h-9 w-36 font-mono"
          />
        </>
      }
    />
  )
}

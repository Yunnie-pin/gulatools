import { json } from "@codemirror/lang-json"
import { useCallback, useState } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"

import { formatJson, type Indent, minifyJson } from "./logic"
import { messages } from "./messages"

const language = json()

const SAMPLE = '{"name":"GulaTools","private":true,"tools":["json","jwt","bcrypt"],"meta":{"version":1,"offline":true}}'

type Mode = "format" | "minify"

const MODES = [
  { value: "format", label: "Format" },
  { value: "minify", label: "Minify" },
] as const satisfies readonly { value: Mode; label: string }[]

export default function JsonFormatter() {
  const t = useMessages(messages)
  const indents = [
    { value: 2, label: t.spaces(2) },
    { value: 4, label: t.spaces(4) },
    { value: "\t", label: "Tab" },
  ] as const satisfies readonly { value: Indent; label: string }[]
  const [mode, setMode] = useState<Mode>("format")
  const [indent, setIndent] = useState<Indent>(2)

  const transform = useCallback(
    (input: string) => (mode === "format" ? formatJson(input, indent) : minifyJson(input)),
    [mode, indent],
  )

  return (
    <TransformTool
      transform={transform}
      inputLanguage={language}
      sample={SAMPLE}
      accept=".json,application/json"
      outputFileName="output.json"
      options={
        <>
          <Segmented<Mode> label="Mode" value={mode} options={MODES} onChange={setMode} />
          {mode === "format" && (
            <Segmented<Indent> label={t.indent} value={indent} options={indents} onChange={setIndent} />
          )}
        </>
      }
    />
  )
}

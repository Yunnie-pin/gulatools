import { javascript } from "@codemirror/lang-javascript"
import type { Extension } from "@uiw/react-codemirror"
import { useCallback } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { isOption, usePersistentState } from "@/lib/persist"
import { type CurlTarget, convertCurl } from "./logic"
import { messages } from "./messages"

const TARGETS = [
  { value: "fetch", label: "JavaScript fetch" },
  { value: "python", label: "Python requests" },
  { value: "go", label: "Go net/http" },
] as const satisfies readonly { value: CurlTarget; label: string }[]

const OUTPUT_LANGUAGES: Partial<Record<CurlTarget, Extension>> = { fetch: javascript() }

const FILE_NAMES: Record<CurlTarget, string> = { fetch: "request.js", python: "request.py", go: "main.go" }

const SAMPLE = `curl 'https://api.example.com/v1/users' \\
  -H 'Authorization: Bearer <token>' \\
  -H 'Content-Type: application/json' \\
  --data-raw '{"name":"Gula","role":"admin"}'`

export default function CurlConverter() {
  const t = useMessages(messages)
  const [target, setTarget] = usePersistentState<CurlTarget>("target", "fetch", isOption(TARGETS))
  const transform = useCallback((input: string) => convertCurl(input, target), [target])

  return (
    <TransformTool
      transform={transform}
      outputLanguage={OUTPUT_LANGUAGES[target]}
      outputFileName={FILE_NAMES[target]}
      sample={SAMPLE}
      options={<Segmented<CurlTarget> label={t.target} value={target} options={TARGETS} onChange={setTarget} />}
    />
  )
}

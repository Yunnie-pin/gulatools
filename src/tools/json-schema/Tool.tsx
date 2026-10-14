import { json } from "@codemirror/lang-json"
import { CircleCheck, CircleX } from "lucide-react"
import { useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { Editor } from "@/components/Editor"
import { ErrorText } from "@/components/ErrorText"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { validateJson } from "./logic"
import { messages } from "./messages"

const JSON_LANGUAGE = json()

const SAMPLE_SCHEMA = JSON.stringify(
  {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    required: ["name", "email", "tags"],
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      age: { type: "integer", minimum: 0 },
      tags: { type: "array", items: { type: "string" }, uniqueItems: true },
    },
    additionalProperties: false,
  },
  null,
  2,
)

const SAMPLE_DATA = JSON.stringify(
  { name: "Jane", email: "not-an-email", age: -1, tags: ["sweet", "sweet"], color: "brown" },
  null,
  2,
)

export default function JsonSchemaTool() {
  const t = useMessages(messages)
  const [schema, setSchema] = usePersistentState("schema", "")
  const [data, setData] = usePersistentState("data", "")
  const result = useMemo(
    () => (schema.trim() && data.trim() ? attempt(() => validateJson(schema, data)) : null),
    [schema, data],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        {result?.ok && (
          <>
            <Badge
              tone={result.value.issues.length ? "danger" : "success"}
              icon={result.value.issues.length ? CircleX : CircleCheck}
            >
              {result.value.issues.length ? t.invalid(result.value.issues.length) : t.valid}
            </Badge>
            <Badge>{t.draft(result.value.draft)}</Badge>
          </>
        )}
        <div className="ml-auto flex gap-2">
          <SampleButton
            onClick={() => {
              setSchema(SAMPLE_SCHEMA)
              setData(SAMPLE_DATA)
            }}
          />
          <ClearButton
            onClick={() => {
              setSchema("")
              setData("")
            }}
            disabled={!schema && !data}
          />
        </div>
      </GlassPanel>

      <div className="grid min-h-[420px] flex-1 gap-4 lg:grid-cols-2">
        <Pane title={t.schema}>
          <Editor
            label={t.schema}
            value={schema}
            onChange={setSchema}
            language={JSON_LANGUAGE}
            placeholder={t.schemaPlaceholder}
          />
        </Pane>
        <Pane title={t.data}>
          <Editor
            label={t.data}
            value={data}
            onChange={setData}
            language={JSON_LANGUAGE}
            placeholder={t.dataPlaceholder}
          />
        </Pane>
      </div>

      {result && !result.ok && (
        <GlassPanel variant="solid" className="p-4">
          <ErrorText className="font-mono">{result.error}</ErrorText>
        </GlassPanel>
      )}

      {result?.ok && result.value.issues.length > 0 && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          <ul aria-label={t.issues}>
            {result.value.issues.map((issue) => (
              <li
                key={`${issue.path}:${issue.message}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-black/5 py-2.5 text-sm last:border-0 dark:border-white/10"
              >
                <code className="min-w-24 font-mono text-danger">{issue.path}</code>
                <span className="flex-1">{issue.message}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      )}
    </div>
  )
}

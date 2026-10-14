import { json } from "@codemirror/lang-json"
import { xml } from "@codemirror/lang-xml"
import { yaml } from "@codemirror/lang-yaml"
import type { Extension } from "@uiw/react-codemirror"
import { ArrowLeftRight } from "lucide-react"
import { useCallback, useState } from "react"
import { Dropdown } from "@/components/glass/Dropdown"
import { GlassButton } from "@/components/glass/GlassButton"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"

import { convert, FORMATS, type Format } from "./logic"
import { messages } from "./messages"

const EDITOR_LANGUAGES: Partial<Record<Format, Extension>> = { json: json(), yaml: yaml(), xml: xml() }

const EXTENSIONS: Record<Format, string> = { json: "json", yaml: "yaml", toml: "toml", xml: "xml", csv: "csv" }

const SAMPLES: Record<Format, string> = {
  json: '{"app":"gulatools","port":8080,"features":["json","yaml"],"db":{"host":"localhost","ssl":false}}',
  yaml: "app: gulatools\nport: 8080\nfeatures:\n  - json\n  - yaml\ndb:\n  host: localhost\n  ssl: false\n",
  toml: 'app = "gulatools"\nport = 8080\nfeatures = ["json", "yaml"]\n\n[db]\nhost = "localhost"\nssl = false\n',
  xml: '<app name="gulatools">\n  <port>8080</port>\n  <feature>json</feature>\n  <feature>yaml</feature>\n</app>',
  csv: "id,name,role\n1,Gula,admin\n2,Manis,editor\n",
}

const FORMAT_OPTIONS = (Object.keys(FORMATS) as Format[]).map((value) => ({ value, label: FORMATS[value] }))

export default function DataConverter() {
  const t = useMessages(messages)
  const [from, setFrom] = useState<Format>("json")
  const [to, setTo] = useState<Format>("yaml")
  const transform = useCallback((input: string) => convert(input, from, to), [from, to])

  return (
    <TransformTool
      transform={transform}
      inputLanguage={EDITOR_LANGUAGES[from]}
      outputLanguage={EDITOR_LANGUAGES[to]}
      sample={SAMPLES[from]}
      accept={`.${EXTENSIONS[from]}`}
      outputFileName={`output.${EXTENSIONS[to]}`}
      options={
        <>
          <Dropdown<Format> label={t.from} value={from} options={FORMAT_OPTIONS} onChange={setFrom} />
          <GlassButton
            aria-label={t.swap}
            onClick={() => {
              setFrom(to)
              setTo(from)
            }}
            className="w-9 px-0"
          >
            <ArrowLeftRight aria-hidden="true" className="size-4" />
          </GlassButton>
          <Dropdown<Format> label={t.to} value={to} options={FORMAT_OPTIONS} onChange={setTo} />
        </>
      }
    />
  )
}

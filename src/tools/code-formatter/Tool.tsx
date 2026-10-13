import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { markdown } from "@codemirror/lang-markdown"
import { yaml } from "@codemirror/lang-yaml"
import type { Extension } from "@uiw/react-codemirror"
import { useCallback, useState } from "react"
import { Checkbox } from "@/components/glass/Checkbox"
import { Dropdown } from "@/components/glass/Dropdown"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { type CodeOptions, formatCode, LANGUAGES, type LanguageId } from "./logic"

const EDITOR_LANGUAGES: Partial<Record<LanguageId, Extension>> = {
  javascript: javascript({ jsx: true }),
  typescript: javascript({ jsx: true, typescript: true }),
  css: css(),
  scss: css(),
  less: css(),
  html: html(),
  markdown: markdown(),
  yaml: yaml(),
}

const SAMPLES: Record<LanguageId, string> = {
  javascript: "const greet=(name)=>{if(!name){return 'halo'}return 'halo '+name}\nexport default greet",
  typescript:
    "interface User{id:number;name:string}\nexport function find(users:User[],id:number):User|undefined{return users.find(u=>u.id===id)}",
  css: ".card{display:flex;gap:8px;padding:16px}.card:hover{background:rgba(255,255,255,.6)}",
  scss: ".card{display:flex;&:hover{color:red}.title{font-weight:600}}",
  less: "@gap:8px;.card{gap:@gap;.title{font-weight:600}}",
  html: '<ul class="tools"><li><a href="/jwt">JWT</a></li><li><a href="/bcrypt">Bcrypt</a></li></ul>',
  markdown: "# GulaTools\n* format\n* parse\n+ encode\n\n|tool|status|\n|-|-|\n|jwt|ok|",
  graphql: "query Tools($first:Int){tools(first:$first){id name category}}",
  yaml: "app:   gulatools\nfeatures: [json,   yaml]\ndb: {host: localhost, port: 5432}",
}

const LANGUAGE_OPTIONS = (Object.keys(LANGUAGES) as LanguageId[]).map((value) => ({
  value,
  label: LANGUAGES[value].label,
}))

const INDENTS = [
  { value: 2, label: "2 spasi" },
  { value: 4, label: "4 spasi" },
] as const satisfies readonly { value: CodeOptions["tabWidth"]; label: string }[]

const WIDTHS = [
  { value: 80, label: "80 kol" },
  { value: 100, label: "100 kol" },
  { value: 120, label: "120 kol" },
] as const satisfies readonly { value: CodeOptions["printWidth"]; label: string }[]

const isScript = (language: LanguageId) => language === "javascript" || language === "typescript"

export default function CodeFormatter() {
  const [options, setOptions] = useState<CodeOptions>({
    language: "javascript",
    tabWidth: 2,
    printWidth: 80,
    semi: true,
    singleQuote: false,
  })
  const set = (next: Partial<CodeOptions>) => setOptions((current) => ({ ...current, ...next }))

  const transform = useCallback((input: string) => formatCode(input, options), [options])

  return (
    <TransformTool
      transform={transform}
      inputLanguage={EDITOR_LANGUAGES[options.language]}
      sample={SAMPLES[options.language]}
      options={
        <>
          <Dropdown<LanguageId>
            label="Bahasa"
            value={options.language}
            options={LANGUAGE_OPTIONS}
            onChange={(language) => set({ language })}
          />
          <Segmented<CodeOptions["tabWidth"]>
            label="Indentasi"
            value={options.tabWidth}
            options={INDENTS}
            onChange={(tabWidth) => set({ tabWidth })}
          />
          <Segmented<CodeOptions["printWidth"]>
            label="Lebar baris"
            value={options.printWidth}
            options={WIDTHS}
            onChange={(printWidth) => set({ printWidth })}
          />
          {isScript(options.language) && (
            <>
              <Checkbox label="Titik koma" checked={options.semi} onChange={(semi) => set({ semi })} />
              <Checkbox
                label="Kutip tunggal"
                checked={options.singleQuote}
                onChange={(singleQuote) => set({ singleQuote })}
              />
            </>
          )}
        </>
      }
    />
  )
}

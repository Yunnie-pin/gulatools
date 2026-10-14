import type { Extension } from "@uiw/react-codemirror"
import { useCallback, useEffect, useState } from "react"
import { Checkbox } from "@/components/glass/Checkbox"
import { Dropdown } from "@/components/glass/Dropdown"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { isOption, oneOf, usePersistentState } from "@/lib/persist"
import { type CodeOptions, formatCode, LANGUAGES, type LanguageId } from "./logic"
import { messages } from "./messages"

const loadCss = async () => (await import("@codemirror/lang-css")).css()

const EDITOR_LANGUAGES: Partial<Record<LanguageId, () => Promise<Extension>>> = {
  javascript: async () => (await import("@codemirror/lang-javascript")).javascript({ jsx: true }),
  typescript: async () => (await import("@codemirror/lang-javascript")).javascript({ jsx: true, typescript: true }),
  css: loadCss,
  scss: loadCss,
  less: loadCss,
  html: async () => (await import("@codemirror/lang-html")).html(),
  markdown: async () => (await import("@codemirror/lang-markdown")).markdown(),
  yaml: async () => (await import("@codemirror/lang-yaml")).yaml(),
}

function useEditorLanguage(language: LanguageId) {
  const [extension, setExtension] = useState<Extension>()

  useEffect(() => {
    let live = true
    setExtension(undefined)
    EDITOR_LANGUAGES[language]?.().then((loaded) => live && setExtension(loaded))
    return () => {
      live = false
    }
  }, [language])

  return extension
}

const SAMPLES: Record<LanguageId, string> = {
  javascript: "const greet=(name)=>{if(!name){return 'hello'}return 'hello '+name}\nexport default greet",
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

const INDENTS = [2, 4] as const satisfies readonly CodeOptions["tabWidth"][]

const WIDTHS = [80, 100, 120] as const satisfies readonly CodeOptions["printWidth"][]

const isCodeOptions = (options: CodeOptions) =>
  isOption(LANGUAGE_OPTIONS)(options.language) && oneOf(INDENTS)(options.tabWidth) && oneOf(WIDTHS)(options.printWidth)

const isScript = (language: LanguageId) => language === "javascript" || language === "typescript"

export default function CodeFormatter() {
  const t = useMessages(messages)
  const [options, setOptions] = usePersistentState<CodeOptions>(
    "options",
    {
      language: "javascript",
      tabWidth: 2,
      printWidth: 80,
      semi: true,
      singleQuote: false,
    },
    isCodeOptions,
  )
  const set = (next: Partial<CodeOptions>) => setOptions((current) => ({ ...current, ...next }))
  const editorLanguage = useEditorLanguage(options.language)

  const transform = useCallback((input: string) => formatCode(input, options), [options])

  return (
    <TransformTool
      transform={transform}
      inputLanguage={editorLanguage}
      sample={SAMPLES[options.language]}
      options={
        <>
          <Dropdown<LanguageId>
            label={t.language}
            value={options.language}
            options={LANGUAGE_OPTIONS}
            onChange={(language) => set({ language })}
          />
          <Segmented<CodeOptions["tabWidth"]>
            label={t.indent}
            value={options.tabWidth}
            options={INDENTS.map((value) => ({ value, label: t.spaces(value) }))}
            onChange={(tabWidth) => set({ tabWidth })}
          />
          <Segmented<CodeOptions["printWidth"]>
            label={t.printWidth}
            value={options.printWidth}
            options={WIDTHS.map((value) => ({ value, label: t.columns(value) }))}
            onChange={(printWidth) => set({ printWidth })}
          />
          {isScript(options.language) && (
            <>
              <Checkbox label={t.semi} checked={options.semi} onChange={(semi) => set({ semi })} />
              <Checkbox
                label={t.singleQuote}
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

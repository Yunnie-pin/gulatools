import { html as htmlLanguage } from "@codemirror/lang-html"
import { markdown } from "@codemirror/lang-markdown"
import { useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { markdownToHtml } from "./logic"
import { messages, type View } from "./messages"
import { sanitizeHtml } from "./sanitize"

const VIEWS = ["preview", "html"] as const satisfies readonly View[]

const MARKDOWN = markdown()
const HTML = htmlLanguage()

const SAMPLE = `# GulaTools

Developer tools yang **manis** dan berjalan _sepenuhnya_ di browser.

## Fitur

- [x] Format JSON dan SQL
- [x] Decode JWT
- [ ] Kopi gratis

| Tool | Kategori |
| ---- | -------- |
| Base64 | Encoder |
| UUID | Generator |

> Data kamu tidak pernah meninggalkan perangkat ini.

\`\`\`ts
const gula = "manis"
\`\`\`

Kunjungi [GitHub](https://github.com) untuk kodenya.
`

export default function MarkdownTool() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "")
  const [view, setView] = usePersistentState<View>("view", "preview", oneOf(VIEWS))
  const html = useMemo(() => sanitizeHtml(markdownToHtml(input)), [input])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<View> label={t.view} value={view} options={labeled(VIEWS, t.views)} onChange={setView} />
        <div className="ml-auto flex gap-2">
          <SampleButton onClick={() => setInput(SAMPLE)} />
          <ClearButton onClick={() => setInput("")} disabled={!input} />
        </div>
      </GlassPanel>

      <div className="grid min-h-[480px] flex-1 gap-4 lg:grid-cols-2">
        <Pane title="Markdown">
          <Editor label="Markdown" value={input} onChange={setInput} language={MARKDOWN} placeholder={t.placeholder} />
        </Pane>
        <Pane title={t.views[view]} action={<CopyButton text={html} />}>
          {view === "preview" ? (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by DOMPurify
            <div className="markdown-body p-4" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <Editor label="HTML" value={html} language={HTML} />
          )}
        </Pane>
      </div>
    </div>
  )
}

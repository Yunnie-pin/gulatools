import { xml } from "@codemirror/lang-xml"
import { Download } from "lucide-react"
import { useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { CopyButton } from "@/components/CopyButton"
import { Editor } from "@/components/Editor"
import { ErrorText } from "@/components/ErrorText"
import { FileDrop } from "@/components/FileDrop"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { RangeField } from "@/components/RangeField"
import { useMessages } from "@/i18n/locale"
import { downloadText } from "@/lib/file"
import { formatBytes } from "@/lib/format"
import { labeled } from "@/lib/options"
import { inRange, oneOf, usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { byteSize, optimizeSvg, type SvgOptions, svgDataUrl } from "./logic"
import { messages, type View } from "./messages"

const XML = xml()
const VIEWS = ["code", "preview"] as const satisfies readonly View[]
const INITIAL: SvgOptions = { precision: 3, multipass: true, pretty: false }

const SAMPLE = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with a vector editor -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="64px" height="64px" viewBox="0 0 64 64">
  <title>Sugar cube</title>
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description about="sugar-cube"/></rdf:RDF>
  </metadata>
  <defs></defs>
  <g id="Layer_1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="cube" transform="translate(8.000000, 8.000000)">
      <rect id="body" fill="#FF6B5E" x="0.000000" y="0.000000" width="48.000000" height="48.000000" rx="10.000000"></rect>
      <circle id="dot" fill="#FFFFFF" cx="24.000000" cy="24.000000" r="8.000000"></circle>
    </g>
  </g>
</svg>
`

const isOptions = (options: SvgOptions) => inRange(0, 6)(options.precision)

export default function SvgOptimizerTool() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("input", "")
  const [options, setOptions] = usePersistentState("options", INITIAL, isOptions)
  const [view, setView] = usePersistentState<View>("view", "code", oneOf(VIEWS))
  const result = useMemo(() => (input.trim() ? attempt(() => optimizeSvg(input, options)) : null), [input, options])
  const output = result?.ok ? result.value : ""
  const before = byteSize(input)
  const after = byteSize(output)

  const update = (next: Partial<SvgOptions>) => setOptions({ ...options, ...next })

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <div className="w-44">
          <RangeField
            label={t.precision}
            value={options.precision}
            min={0}
            max={6}
            onChange={(precision) => update({ precision })}
          />
        </div>
        <Checkbox label={t.multipass} checked={options.multipass} onChange={(multipass) => update({ multipass })} />
        <Checkbox label={t.pretty} checked={options.pretty} onChange={(pretty) => update({ pretty })} />
        {result?.ok && (
          <Badge tone={after < before ? "success" : "neutral"}>
            {t.size(formatBytes(before), formatBytes(after), Math.max(0, Math.round((1 - after / before) * 100)))}
          </Badge>
        )}
        <div className="ml-auto flex gap-2">
          <SampleButton onClick={() => setInput(SAMPLE)} />
          <ClearButton onClick={() => setInput("")} disabled={!input} />
        </div>
      </GlassPanel>

      <div className="grid min-h-[480px] flex-1 gap-4 lg:grid-cols-2">
        <FileDrop label="SVG" onFile={async (file) => setInput(await file.text())} className="flex min-h-0">
          <Pane title="SVG" className="flex-1">
            <Editor label="SVG" value={input} onChange={setInput} language={XML} placeholder={t.placeholder} />
          </Pane>
        </FileDrop>
        <Pane
          title="Output"
          action={
            <div className="flex items-center gap-2">
              <Segmented<View> label={t.view} value={view} options={labeled(VIEWS, t.views)} onChange={setView} />
              <GlassButton
                aria-label={t.download}
                title={t.download}
                disabled={!output}
                onClick={() => downloadText(output, "optimized.svg", "image/svg+xml")}
                className="h-9 w-9 px-0"
              >
                <Download aria-hidden="true" className="size-4" />
              </GlassButton>
              <CopyButton text={output} />
            </div>
          }
        >
          {result && !result.ok ? (
            <ErrorText className="p-4 font-mono">{result.error}</ErrorText>
          ) : view === "code" ? (
            <Editor label="Output" value={output} language={XML} />
          ) : (
            output && (
              <div className="grid h-full min-h-72 place-items-center bg-[repeating-conic-gradient(#0001_0_25%,transparent_0_50%)] bg-[length:16px_16px] p-6">
                <img src={svgDataUrl(output)} alt={t.preview} className="max-h-96 max-w-full" />
              </div>
            )
          )}
        </Pane>
      </div>
    </div>
  )
}

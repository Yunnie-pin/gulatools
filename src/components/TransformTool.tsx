import type { Extension } from "@uiw/react-codemirror"
import { Download, Upload } from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { downloadText, pickFile } from "@/lib/file"
import { type Result, settle } from "@/lib/result"
import { toast } from "@/lib/toast"
import { ClearButton, SampleButton } from "./ActionButtons"
import { CopyButton } from "./CopyButton"
import { Editor } from "./Editor"
import { ErrorText } from "./ErrorText"
import { FileDrop } from "./FileDrop"
import { glassButtonClass } from "./glass/GlassButton"
import { GlassMenu } from "./glass/GlassMenu"
import { GlassPanel } from "./glass/GlassPanel"
import { MoreIcon } from "./icons"
import { Pane } from "./Pane"

type TransformToolProps = {
  transform: (input: string) => string | Promise<string>
  inputLanguage?: Extension
  outputLanguage?: Extension
  sample?: string
  options?: ReactNode
  accept?: string
  outputFileName?: string
}

export function TransformTool({
  transform,
  inputLanguage,
  outputLanguage = inputLanguage,
  sample,
  options,
  accept,
  outputFileName = "output.txt",
}: TransformToolProps) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<Result<string>>({ ok: true, value: "" })

  useEffect(() => {
    let live = true
    settle(() => (input.trim() ? transform(input) : "")).then((next) => live && setResult(next))
    return () => {
      live = false
    }
  }, [transform, input])
  const output = result.ok ? result.value : ""

  const loadFile = async (file: File | null) => {
    if (!file) return
    setInput(await file.text())
    toast(`${file.name} dimuat`)
  }

  const menuItems = [
    { label: "Buka file…", icon: Upload, onSelect: async () => loadFile(await pickFile(accept)) },
    {
      label: "Unduh output",
      icon: Download,
      onSelect: () => (output ? downloadText(output, outputFileName) : toast("Output masih kosong", "error")),
    },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <GlassPanel className="relative z-10 flex flex-wrap items-center gap-3 px-4 py-3">
        {options}
        <div className="relative ml-auto flex gap-2">
          {sample && <SampleButton onClick={() => setInput(sample)} />}
          <ClearButton onClick={() => setInput("")} disabled={!input} />
          <GlassMenu
            label="Opsi lain"
            items={menuItems}
            trigger={<MoreIcon className="h-2.5 w-6" />}
            triggerClassName={glassButtonClass("frost", "w-11 px-0")}
            className="top-11 right-0 origin-top-right"
          />
        </div>
      </GlassPanel>

      <div className="grid min-h-[480px] flex-1 gap-4 lg:grid-cols-2">
        <FileDrop label="Input" onFile={loadFile} className="flex min-h-0">
          <Pane title="Input" className="flex-1">
            <Editor
              label="Input"
              value={input}
              onChange={setInput}
              language={inputLanguage}
              placeholder="Tempel di sini, atau seret file ke sini…"
            />
          </Pane>
        </FileDrop>
        <Pane title="Output" action={<CopyButton text={output} />}>
          {result.ok ? (
            <Editor label="Output" value={result.value} language={outputLanguage} />
          ) : (
            <ErrorText className="p-4 font-mono">{result.error}</ErrorText>
          )}
        </Pane>
      </div>
    </div>
  )
}

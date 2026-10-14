import { Download, FileUp, QrCode, ScanLine } from "lucide-react"
import { useMemo, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { FileDrop } from "@/components/FileDrop"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { useMessages } from "@/i18n/locale"
import { downloadText, downloadUrl, pickFile } from "@/lib/file"
import { isOption, usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { useAsync } from "@/lib/use-async"
import { createQrMatrix, createQrPng, createQrSvg, type ErrorLevel, scanQr } from "./logic"
import { messages } from "./messages"

type Mode = "create" | "scan"

const MODES = [
  { value: "create", icon: QrCode },
  { value: "scan", icon: ScanLine },
] as const satisfies readonly Omit<SegmentedOption<Mode>, "label">[]

const LEVELS = [
  { value: "L", label: "L · 7%" },
  { value: "M", label: "M · 15%" },
  { value: "Q", label: "Q · 25%" },
  { value: "H", label: "H · 30%" },
] as const satisfies readonly SegmentedOption<ErrorLevel>[]

export default function QrTool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<Mode>("mode", "create", isOption(MODES))

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="px-4 py-3">
        <Segmented<Mode>
          label="Mode"
          value={mode}
          options={MODES.map((option) => ({ ...option, label: t.modes[option.value] }))}
          onChange={setMode}
        />
      </GlassPanel>
      {mode === "create" ? <CreatePanel /> : <ScanPanel />}
    </div>
  )
}

function CreatePanel() {
  const t = useMessages(messages)
  const [text, setText] = usePersistentState("text", "https://gulatools.dev")
  const [level, setLevel] = usePersistentState<ErrorLevel>("level", "M", isOption(LEVELS))
  const matrix = useMemo(() => attempt(() => createQrMatrix(text, level)), [text, level])

  const downloadPng = async () => downloadUrl(await createQrPng(text, level), "qrcode.png")
  const downloadSvg = async () => downloadText(await createQrSvg(text, level), "qrcode.svg", "image/svg+xml")

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Field label={t.textOrUrl}>
          {(id) => (
            <GlassTextarea
              id={id}
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-sans"
            />
          )}
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">{t.errorCorrection}</span>
          <Segmented<ErrorLevel> label={t.errorCorrection} value={level} options={LEVELS} onChange={setLevel} />
          <span className="text-xs text-ink-soft">{t.levelHint}</span>
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col items-center gap-4 p-5">
        {matrix.ok ? (
          <>
            <svg
              role="img"
              aria-label={t.qrFor(text)}
              viewBox={`-2 -2 ${matrix.value.size + 4} ${matrix.value.size + 4}`}
              shapeRendering="crispEdges"
              className="aspect-square w-full max-w-72 rounded-glass-sm bg-white"
            >
              <path d={matrix.value.path} fill="#000" />
            </svg>
            <div className="flex gap-2">
              <GlassButton onClick={downloadPng}>
                <Download aria-hidden="true" className="size-4" />
                PNG
              </GlassButton>
              <GlassButton onClick={downloadSvg}>
                <Download aria-hidden="true" className="size-4" />
                SVG
              </GlassButton>
            </div>
          </>
        ) : (
          <ErrorText>{matrix.error}</ErrorText>
        )}
      </GlassPanel>
    </div>
  )
}

function ScanPanel() {
  const t = useMessages(messages)
  const [preview, setPreview] = useState<string | null>(null)
  const task = useAsync(scanQr)

  const load = (file: File | null) => {
    if (!file) return
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
    task.run(file)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FileDrop label={t.qrImage} onFile={load}>
        <GlassPanel
          variant="solid"
          className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center"
        >
          {preview ? (
            <img src={preview} alt={t.scannedImage} className="max-h-56 rounded-glass-sm object-contain" />
          ) : (
            <FileUp aria-hidden="true" className="size-8 text-ink-soft" />
          )}
          <p className="text-sm text-ink-soft">{t.dropHint}</p>
          <GlassButton onClick={async () => load(await pickFile("image/*"))} disabled={task.pending}>
            {task.pending ? t.reading : t.pickImage}
          </GlassButton>
        </GlassPanel>
      </FileDrop>

      <GlassPanel variant="solid" className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-soft">{t.contents}</h2>
          {task.result?.ok && <CopyButton text={task.result.value} />}
        </div>
        {!task.result && <p className="text-sm text-ink-soft">{t.nothingScanned}</p>}
        {task.result &&
          (task.result.ok ? (
            <p className="font-mono text-sm break-all whitespace-pre-wrap">{task.result.value}</p>
          ) : (
            <ErrorText>{task.result.error}</ErrorText>
          ))}
      </GlassPanel>
    </div>
  )
}

import { Download, FileUp, QrCode, ScanLine } from "lucide-react"
import { useEffect, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { FileDrop } from "@/components/FileDrop"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { downloadText, downloadUrl, pickFile } from "@/lib/file"
import { type Result, settle } from "@/lib/result"
import { useAsync } from "@/lib/use-async"
import { createQrPng, createQrSvg, type ErrorLevel, scanQr } from "./logic"

type Mode = "create" | "scan"

const MODES = [
  { value: "create", label: "Buat", icon: QrCode },
  { value: "scan", label: "Pindai", icon: ScanLine },
] as const satisfies readonly SegmentedOption<Mode>[]

const LEVELS = [
  { value: "L", label: "L · 7%" },
  { value: "M", label: "M · 15%" },
  { value: "Q", label: "Q · 25%" },
  { value: "H", label: "H · 30%" },
] as const satisfies readonly SegmentedOption<ErrorLevel>[]

export default function QrTool() {
  const [mode, setMode] = useState<Mode>("create")

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="px-4 py-3">
        <Segmented<Mode> label="Mode" value={mode} options={MODES} onChange={setMode} />
      </GlassPanel>
      {mode === "create" ? <CreatePanel /> : <ScanPanel />}
    </div>
  )
}

function CreatePanel() {
  const [text, setText] = useState("https://gulatools.dev")
  const [level, setLevel] = useState<ErrorLevel>("M")
  const [png, setPng] = useState<Result<string> | null>(null)

  useEffect(() => {
    let live = true
    settle(() => createQrPng(text, level)).then((next) => live && setPng(next))
    return () => {
      live = false
    }
  }, [text, level])

  const downloadSvg = async () => downloadText(await createQrSvg(text, level), "qrcode.svg", "image/svg+xml")

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Field label="Teks atau URL">
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
          <span className="text-sm font-medium text-ink-soft">Koreksi error</span>
          <Segmented<ErrorLevel> label="Koreksi error" value={level} options={LEVELS} onChange={setLevel} />
          <span className="text-xs text-ink-soft">Level lebih tinggi lebih tahan rusak, tapi kodenya lebih padat.</span>
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col items-center gap-4 p-5">
        {png?.ok ? (
          <>
            <img
              src={png.value}
              alt={`QR code untuk ${text}`}
              className="aspect-square w-full max-w-72 rounded-glass-sm bg-white"
            />
            <div className="flex gap-2">
              <GlassButton onClick={() => downloadUrl(png.value, "qrcode.png")}>
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
          png && <ErrorText>{png.error}</ErrorText>
        )}
      </GlassPanel>
    </div>
  )
}

function ScanPanel() {
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
      <FileDrop label="Gambar QR code" onFile={load}>
        <GlassPanel
          variant="solid"
          className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center"
        >
          {preview ? (
            <img src={preview} alt="Gambar yang dipindai" className="max-h-56 rounded-glass-sm object-contain" />
          ) : (
            <FileUp aria-hidden="true" className="size-8 text-ink-soft" />
          )}
          <p className="text-sm text-ink-soft">Seret gambar berisi QR code ke sini</p>
          <GlassButton onClick={async () => load(await pickFile("image/*"))} disabled={task.pending}>
            {task.pending ? "Membaca…" : "Pilih gambar"}
          </GlassButton>
        </GlassPanel>
      </FileDrop>

      <GlassPanel variant="solid" className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-soft">Isi QR code</h2>
          {task.result?.ok && <CopyButton text={task.result.value} />}
        </div>
        {!task.result && <p className="text-sm text-ink-soft">Belum ada gambar yang dipindai.</p>}
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

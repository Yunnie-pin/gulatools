import { Download, FileUp, ImageDown, ImageUp } from "lucide-react"
import { useMemo, useState } from "react"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { FileDrop } from "@/components/FileDrop"
import { Dropdown } from "@/components/glass/Dropdown"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { downloadUrl, pickFile, readAsDataUrl } from "@/lib/file"
import { formatBytes } from "@/lib/format"
import { isOption, usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { useAsync } from "@/lib/use-async"
import { extensionFor, IMAGE_TYPES, type ImageType, snippets, toDataUrl, typeOf } from "./logic"
import { messages } from "./messages"

type Mode = "encode" | "decode"

const MODES = [
  { value: "encode", icon: ImageUp },
  { value: "decode", icon: ImageDown },
] as const satisfies readonly Omit<SegmentedOption<Mode>, "label">[]

const PREVIEW_CHARS = 160

export default function ImageBase64Tool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<Mode>("mode", "encode", isOption(MODES))

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
      {mode === "encode" ? <EncodePanel /> : <DecodePanel />}
    </div>
  )
}

type PreviewProps = { src: string; onSize?: (size: string) => void; onError?: () => void }

function Preview({ src, onSize, onError }: PreviewProps) {
  const t = useMessages(messages)
  return (
    <div className="grid min-h-48 place-items-center rounded-glass-sm bg-[repeating-conic-gradient(#0001_0_25%,transparent_0_50%)] bg-[length:16px_16px] p-3">
      <img
        src={src}
        alt={t.preview}
        onLoad={(e) => onSize?.(`${e.currentTarget.naturalWidth} × ${e.currentTarget.naturalHeight} px`)}
        onError={onError}
        className="max-h-72 max-w-full object-contain"
      />
    </div>
  )
}

function EncodePanel() {
  const t = useMessages(messages)
  const [file, setFile] = useState<File | null>(null)
  const [dimensions, setDimensions] = useState("")
  const task = useAsync(readAsDataUrl)
  const output = task.result?.ok ? snippets(task.result.value) : null

  const load = (picked: File | null) => {
    if (!picked) return
    if (!picked.type.startsWith("image/")) {
      setFile(null)
      task.reset()
      return
    }
    setFile(picked)
    setDimensions("")
    task.run(picked)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <FileDrop label={t.image} onFile={load}>
        <GlassPanel variant="solid" className="flex flex-col gap-3 p-5">
          {output ? (
            <Preview src={output.dataUrl} onSize={setDimensions} />
          ) : (
            <div className="grid min-h-48 place-items-center">
              <FileUp aria-hidden="true" className="size-8 text-ink-soft" />
            </div>
          )}
          <p className="text-center text-sm text-ink-soft">
            {file ? [file.name, formatBytes(file.size), dimensions].filter(Boolean).join(" · ") : t.dropHint}
          </p>
          <GlassButton className="self-center" onClick={async () => load(await pickFile("image/*"))}>
            {t.pickImage}
          </GlassButton>
          {task.result && !task.result.ok && <ErrorText>{task.result.error}</ErrorText>}
        </GlassPanel>
      </FileDrop>

      {output && (
        <GlassPanel variant="solid" className="h-fit px-4 py-1.5">
          <ValueRow label="Data URI" value={output.dataUrl} truncateAt={PREVIEW_CHARS} />
          <ValueRow label="Base64" value={output.base64} truncateAt={PREVIEW_CHARS} />
          <ValueRow label="CSS" value={output.css} truncateAt={PREVIEW_CHARS} />
          <ValueRow label="HTML" value={output.html} truncateAt={PREVIEW_CHARS} />
        </GlassPanel>
      )}
    </div>
  )
}

function DecodePanel() {
  const t = useMessages(messages)
  const [input, setInput] = usePersistentState("decodeInput", "")
  const [fallbackType, setFallbackType] = usePersistentState<ImageType>(
    "fallbackType",
    "image/png",
    isOption(IMAGE_TYPES),
  )
  const [broken, setBroken] = useState(false)
  const dataUrl = useMemo(
    () => (input.trim() ? attempt(() => toDataUrl(input, fallbackType)) : null),
    [input, fallbackType],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Field label={t.dataInput}>
          {(id) => (
            <GlassTextarea
              id={id}
              rows={10}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setBroken(false)
              }}
              placeholder="data:image/png;base64,iVBORw0KGgo…"
            />
          )}
        </Field>
        <div className="flex items-center gap-3 text-sm text-ink-soft">
          {t.rawType}
          <Dropdown<ImageType>
            label={t.imageType}
            value={fallbackType}
            options={IMAGE_TYPES}
            onChange={setFallbackType}
          />
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col gap-3 p-5">
        {!dataUrl && <p className="text-sm text-ink-soft">{t.previewHint}</p>}
        {dataUrl && !dataUrl.ok && <ErrorText>{dataUrl.error}</ErrorText>}
        {dataUrl?.ok &&
          (broken ? (
            <ErrorText>{t.broken}</ErrorText>
          ) : (
            <>
              <Preview src={dataUrl.value} onError={() => setBroken(true)} />
              <GlassButton
                className="self-start"
                onClick={() => downloadUrl(dataUrl.value, `${t.fileName}.${extensionFor(typeOf(dataUrl.value))}`)}
              >
                <Download aria-hidden="true" className="size-4" />
                {t.downloadImage}
              </GlassButton>
            </>
          ))}
      </GlassPanel>
    </div>
  )
}

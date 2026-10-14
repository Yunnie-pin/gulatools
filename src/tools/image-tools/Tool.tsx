import { Download, FileUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { FileDrop } from "@/components/FileDrop"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { RangeField } from "@/components/RangeField"
import { useMessages } from "@/i18n/locale"
import { downloadUrl, pickFile } from "@/lib/file"
import { formatBytes } from "@/lib/format"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { type Result, settle } from "@/lib/result"
import { decodeImage, encodeImage, FORMATS, type ImageFormat, outputName, savings, targetSize } from "./logic"
import { messages } from "./messages"

type Source = { file: File; bitmap: ImageBitmap; url: string }
type Output = { blob: Blob; url: string }

const isQuality = (value: number) => value >= 0.1 && value <= 1

function Preview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-glass-sm bg-[repeating-conic-gradient(#0001_0_25%,transparent_0_50%)] bg-[length:16px_16px] p-3">
      <img src={src} alt={alt} className="max-h-72 max-w-full object-contain" />
    </div>
  )
}

export default function ImageToolsTool() {
  const t = useMessages(messages)
  const [format, setFormat] = usePersistentState<ImageFormat>("format", "webp", oneOf(FORMATS))
  const [quality, setQuality] = usePersistentState<number>("quality", 0.8, isQuality)
  const [source, setSource] = useState<Source | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [width, setWidth] = useState(0)
  const [output, setOutput] = useState<Result<Output> | null>(null)
  const size = source ? targetSize(source.bitmap, width) : null
  const targetWidth = size?.width ?? 0
  const targetHeight = size?.height ?? 0

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
    }
  }, [source])

  useEffect(() => {
    return () => {
      if (output?.ok) URL.revokeObjectURL(output.value.url)
    }
  }, [output])

  useEffect(() => {
    if (!source) return
    let live = true
    setOutput(null)
    const target = { width: targetWidth, height: targetHeight }
    settle(() => encodeImage(source.bitmap, target, format, quality)).then((result) => {
      if (live)
        setOutput(
          result.ok ? { ok: true, value: { blob: result.value, url: URL.createObjectURL(result.value) } } : result,
        )
    })
    return () => {
      live = false
    }
  }, [source, targetWidth, targetHeight, format, quality])

  const load = async (file: File | null) => {
    if (!file) return
    const decoded = await settle(() => decodeImage(file))
    setLoadError(decoded.ok ? null : decoded.error)
    if (!decoded.ok) return
    setSource({ file, bitmap: decoded.value, url: URL.createObjectURL(file) })
    setWidth(decoded.value.width)
  }

  const change = output?.ok && source ? savings(source.file.size, output.value.blob.size) : 0

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FileDrop label={t.image} onFile={load}>
        <GlassPanel variant="solid" className="flex flex-col gap-3 p-5">
          {source ? (
            <Preview src={source.url} alt={t.original} />
          ) : (
            <div className="grid min-h-48 place-items-center">
              <FileUp aria-hidden="true" className="size-8 text-ink-soft" />
            </div>
          )}
          <p className="text-center text-sm text-ink-soft">
            {source
              ? [
                  source.file.name,
                  formatBytes(source.file.size),
                  `${source.bitmap.width} × ${source.bitmap.height} px`,
                ].join(" · ")
              : t.dropHint}
          </p>
          <GlassButton className="self-center" onClick={async () => load(await pickFile("image/*"))}>
            {t.pickImage}
          </GlassButton>
          {loadError && <ErrorText>{loadError}</ErrorText>}
        </GlassPanel>
      </FileDrop>

      {source && size && (
        <div className="flex flex-col gap-4">
          <GlassPanel variant="solid" className="flex flex-col gap-4 p-4">
            <Segmented<ImageFormat>
              label={t.format}
              value={format}
              options={labeled(FORMATS, t.formats)}
              onChange={setFormat}
            />
            {format !== "png" && (
              <RangeField
                label={t.quality}
                value={quality}
                min={0.1}
                max={1}
                step={0.05}
                format={(value) => `${Math.round(value * 100)}%`}
                onChange={setQuality}
              />
            )}
            <Field label={t.width} hint={`${size.width} × ${size.height} px`}>
              {(id) => (
                <GlassInput
                  id={id}
                  type="number"
                  min={1}
                  max={source.bitmap.width}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-32"
                />
              )}
            </Field>
          </GlassPanel>

          <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
            {!output && <p className="text-sm text-ink-soft">{t.processing}</p>}
            {output && !output.ok && <ErrorText>{output.error}</ErrorText>}
            {output?.ok && (
              <>
                <Preview src={output.value.url} alt={t.result} />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm">{formatBytes(output.value.blob.size)}</span>
                  <Badge tone={change >= 0 ? "success" : "danger"}>
                    {change >= 0 ? t.smaller(change) : t.larger(-change)}
                  </Badge>
                  <GlassButton
                    variant="key"
                    className="ml-auto"
                    onClick={() => downloadUrl(output.value.url, outputName(source.file.name, format))}
                  >
                    <Download aria-hidden="true" className="size-4" />
                    {t.download}
                  </GlassButton>
                </div>
              </>
            )}
          </GlassPanel>
        </div>
      )}
    </div>
  )
}

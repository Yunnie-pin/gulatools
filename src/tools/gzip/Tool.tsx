import { useCallback } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { isOption, oneOf, usePersistentState } from "@/lib/persist"
import { type CompressionFormat, compress, decompress } from "./logic"
import { messages } from "./messages"

type Mode = "compress" | "decompress"

const MODES = ["compress", "decompress"] as const satisfies readonly Mode[]

const FORMATS = [
  { value: "gzip", label: "gzip" },
  { value: "deflate", label: "zlib" },
  { value: "deflate-raw", label: "raw deflate" },
] as const satisfies readonly { value: CompressionFormat; label: string }[]

const SAMPLE_TEXT = '{"tool":"gzip","message":"gula gula gula manis, gula gula gula manis"}'
const SAMPLE_GZIP = "H4sIAAAAAAAACqtWKsnPz1GyUkqvyixQ0lHKTS0uTkxPBQmU5iQqIIjcxLzMYh0FbKJKtQBCMnepRgAAAA=="

export default function GzipTool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<Mode>("mode", "compress", oneOf(MODES))
  const [format, setFormat] = usePersistentState<CompressionFormat>("format", "gzip", isOption(FORMATS))
  const transform = useCallback(
    async (input: string) => (mode === "compress" ? compress(input, format) : (await decompress(input.trim())).text),
    [mode, format],
  )

  return (
    <TransformTool
      transform={transform}
      sample={mode === "compress" ? SAMPLE_TEXT : SAMPLE_GZIP}
      outputFileName={mode === "compress" ? "compressed.b64" : "decompressed.txt"}
      options={
        <>
          <Segmented<Mode> label="Mode" value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />
          {mode === "compress" ? (
            <Segmented<CompressionFormat> label={t.format} value={format} options={FORMATS} onChange={setFormat} />
          ) : (
            <span className="text-sm text-ink-soft">{t.autoDetect}</span>
          )}
        </>
      }
    />
  )
}

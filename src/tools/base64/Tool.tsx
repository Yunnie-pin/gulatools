import { useCallback } from "react"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { isOption, oneOf, usePersistentState } from "@/lib/persist"
import { decodeText, type Encoding, encodeText } from "./logic"
import { messages } from "./messages"

type Mode = "encode" | "decode"
type Variant = "standard" | "url"

const MODES = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
] as const satisfies readonly { value: Mode; label: string }[]

const ENCODINGS = [
  { value: "base64", label: "Base64" },
  { value: "base32", label: "Base32" },
  { value: "base58", label: "Base58" },
  { value: "hex", label: "Hex" },
] as const satisfies readonly { value: Encoding; label: string }[]

const VARIANTS = ["standard", "url"] as const satisfies readonly Variant[]

export default function Base64Tool() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<Mode>("mode", "encode", isOption(MODES))
  const [encoding, setEncoding] = usePersistentState<Encoding>("encoding", "base64", isOption(ENCODINGS))
  const [variant, setVariant] = usePersistentState<Variant>("variant", "standard", oneOf(VARIANTS))

  const transform = useCallback(
    (input: string) =>
      mode === "encode" ? encodeText(input, encoding, variant === "url") : decodeText(input, encoding),
    [mode, encoding, variant],
  )

  return (
    <TransformTool
      transform={transform}
      sample={mode === "encode" ? t.sample : encodeText(t.sample, encoding)}
      options={
        <>
          <Segmented<Mode> label="Mode" value={mode} options={MODES} onChange={setMode} />
          <Segmented<Encoding> label={t.encoding} value={encoding} options={ENCODINGS} onChange={setEncoding} />
          {mode === "encode" && encoding === "base64" && (
            <Segmented<Variant>
              label={t.variant}
              value={variant}
              options={labeled(VARIANTS, t.variants)}
              onChange={setVariant}
            />
          )}
        </>
      }
    />
  )
}

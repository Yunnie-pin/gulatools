import { useCallback } from "react"
import { Checkbox } from "@/components/glass/Checkbox"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { isOption, usePersistentState } from "@/lib/persist"
import { type SlugSeparator, slugifyLines } from "./logic"
import { messages } from "./messages"

const SEPARATORS = [
  { value: "-", label: "-" },
  { value: "_", label: "_" },
  { value: ".", label: "." },
] as const satisfies readonly { value: SlugSeparator; label: string }[]

export default function SlugGenerator() {
  const t = useMessages(messages)
  const [separator, setSeparator] = usePersistentState<SlugSeparator>("separator", "-", isOption(SEPARATORS))
  const [lowercase, setLowercase] = usePersistentState("lowercase", true)
  const transform = useCallback((input: string) => slugifyLines(input, separator, lowercase), [separator, lowercase])

  return (
    <TransformTool
      transform={transform}
      sample={t.sample}
      outputFileName="slugs.txt"
      options={
        <>
          <Segmented<SlugSeparator>
            label={t.separator}
            value={separator}
            options={SEPARATORS}
            onChange={setSeparator}
          />
          <Checkbox label={t.lowercase} checked={lowercase} onChange={setLowercase} />
        </>
      }
    />
  )
}

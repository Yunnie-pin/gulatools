import { useCallback } from "react"
import { Checkbox } from "@/components/glass/Checkbox"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import { type LineOrder, processLines } from "./logic"
import { messages } from "./messages"

const ORDERS = ["keep", "asc", "desc", "reverse", "shuffle"] as const satisfies readonly LineOrder[]

const SAMPLE = "banana\nApple\ncherry\nfile10.txt\nbanana\n\nfile2.txt\napple  "

export default function SortLines() {
  const t = useMessages(messages)
  const [order, setOrder] = usePersistentState<LineOrder>("order", "asc", oneOf(ORDERS))
  const [unique, setUnique] = usePersistentState("unique", true)
  const [ignoreCase, setIgnoreCase] = usePersistentState("ignoreCase", false)
  const [trim, setTrim] = usePersistentState("trim", true)
  const [removeEmpty, setRemoveEmpty] = usePersistentState("removeEmpty", true)

  const transform = useCallback(
    (input: string) => processLines(input, { order, unique, ignoreCase, trim, removeEmpty }),
    [order, unique, ignoreCase, trim, removeEmpty],
  )

  return (
    <TransformTool
      transform={transform}
      sample={SAMPLE}
      outputFileName="lines.txt"
      options={
        <>
          <Segmented<LineOrder> label={t.order} value={order} options={labeled(ORDERS, t.orders)} onChange={setOrder} />
          <Checkbox label={t.unique} checked={unique} onChange={setUnique} />
          <Checkbox label={t.ignoreCase} checked={ignoreCase} onChange={setIgnoreCase} />
          <Checkbox label={t.trim} checked={trim} onChange={setTrim} />
          <Checkbox label={t.removeEmpty} checked={removeEmpty} onChange={setRemoveEmpty} />
        </>
      }
    />
  )
}

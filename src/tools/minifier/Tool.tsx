import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import { useCallback } from "react"
import { Badge } from "@/components/Badge"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { isOption, usePersistentState } from "@/lib/persist"
import { type MinifyLanguage, minify, sizeOf } from "./logic"
import { messages } from "./messages"

const LANGUAGES = [
  { value: "js", label: "JavaScript" },
  { value: "css", label: "CSS" },
] as const satisfies readonly { value: MinifyLanguage; label: string }[]

const EDITOR_LANGUAGES = { js: javascript(), css: css() }

const SAMPLES: Record<MinifyLanguage, string> = {
  js: `// Hitung total belanja
export function total(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const afterDiscount = subtotal - subtotal * discount
  return Math.round(afterDiscount)
}
`,
  css: `/* Kartu kaca */
.card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 0px 16px 0px 16px;
}

.card {
  margin: 0px;
}
`,
}

export default function Minifier() {
  const t = useMessages(messages)
  const [language, setLanguage] = usePersistentState<MinifyLanguage>("language", "js", isOption(LANGUAGES))
  const transform = useCallback((input: string) => minify(input, language), [language])

  const summary = (input: string, output: string) => {
    const before = sizeOf(input)
    const after = sizeOf(output)
    return <Badge tone="success">{t.saved(before, after, Math.round((1 - after / before) * 100))}</Badge>
  }

  return (
    <TransformTool
      transform={transform}
      inputLanguage={EDITOR_LANGUAGES[language]}
      outputFileName={language === "css" ? "style.min.css" : "script.min.js"}
      sample={SAMPLES[language]}
      summary={summary}
      options={
        <Segmented<MinifyLanguage> label={t.language} value={language} options={LANGUAGES} onChange={setLanguage} />
      }
    />
  )
}

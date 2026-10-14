import { json } from "@codemirror/lang-json"
import { useCallback, useState } from "react"
import { GlassInput } from "@/components/glass/GlassInput"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"

import { queryJson } from "./logic"
import { messages } from "./messages"

const language = json()

const SAMPLE = JSON.stringify({
  store: {
    book: [
      { category: "fiksi", title: "Laskar Pelangi", author: "Andrea Hirata", price: 85000 },
      { category: "fiksi", title: "Bumi Manusia", author: "Pramoedya Ananta Toer", price: 120000 },
      { category: "sains", title: "Kosmos", author: "Carl Sagan", price: 150000 },
    ],
    location: { city: "Jakarta" },
  },
})

export default function JsonPathTool() {
  const t = useMessages(messages)
  const [path, setPath] = useState("$.store.book[?(@.price > 100000)].title")
  const transform = useCallback((input: string) => queryJson(input, path), [path])

  return (
    <TransformTool
      transform={transform}
      inputLanguage={language}
      sample={SAMPLE}
      accept=".json,application/json"
      outputFileName="result.json"
      options={
        <GlassInput
          aria-label={t.expression}
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.book[*].title"
          spellCheck={false}
          className="h-9 min-w-72 flex-1 font-mono"
        />
      }
    />
  )
}

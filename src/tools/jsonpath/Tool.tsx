import { json } from "@codemirror/lang-json"
import { useCallback } from "react"
import { GlassInput } from "@/components/glass/GlassInput"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { queryJson } from "./logic"
import { messages } from "./messages"

const language = json()

const SAMPLE = JSON.stringify({
  store: {
    book: [
      { category: "fiction", title: "The Hobbit", author: "J. R. R. Tolkien", price: 8.99 },
      { category: "fiction", title: "Dune", author: "Frank Herbert", price: 12.99 },
      { category: "science", title: "Cosmos", author: "Carl Sagan", price: 15.99 },
    ],
    location: { city: "London" },
  },
})

export default function JsonPathTool() {
  const t = useMessages(messages)
  const [path, setPath] = usePersistentState("path", "$.store.book[?(@.price > 10)].title")
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

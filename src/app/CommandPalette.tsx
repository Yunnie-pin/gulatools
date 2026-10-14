import Fuse from "fuse.js"
import { Search } from "lucide-react"
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { cx } from "@/lib/cx"
import { useLightDismiss } from "@/lib/dialog"
import { onOpenPalette } from "@/lib/palette"
import { CATEGORIES, type Tool } from "@/lib/tool"
import { useUsage } from "@/lib/usage"
import { resolveTools, tools } from "@/tools/registry"

const fuse = new Fuse(tools, { keys: ["name", "keywords", "description.id", "description.en"], threshold: 0.4 })

export function CommandPalette() {
  const id = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const t = useMessages(ui).shell
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const lightDismiss = useLightDismiss()

  const { recent } = useUsage()
  const results = useMemo(() => {
    if (query.trim()) return fuse.search(query).map((r) => r.item)
    const first = resolveTools(recent.map((entry) => entry.id))
    return [...first, ...tools.filter((tool) => !first.includes(tool))]
  }, [query, recent])

  const select = (tool: Tool | undefined) => {
    if (!tool) return
    dialogRef.current?.close()
    navigate(`/${tool.id}`)
  }

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const dialog = dialogRef.current
      if (!dialog || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return
      e.preventDefault()
      if (dialog.open) dialog.close()
      else dialog.showModal()
    }
    document.addEventListener("keydown", onKey)
    const unsubscribe = onOpenPalette(() => dialogRef.current?.showModal())
    return () => {
      document.removeEventListener("keydown", onKey)
      unsubscribe()
    }
  }, [])

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const move = (step: number) => {
      e.preventDefault()
      if (!results.length) return
      setActive((i) => (i + step + results.length) % results.length)
    }
    if (e.key === "ArrowDown") move(1)
    else if (e.key === "ArrowUp") move(-1)
    else if (e.key === "Enter") select(results[active])
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.searchTool}
      {...lightDismiss}
      onClose={() => {
        setQuery("")
        setActive(0)
      }}
      className="glass glass-strong m-auto mt-[15vh] w-[min(560px,calc(100%-2rem))] rounded-glass p-0 text-ink backdrop:bg-black/30"
    >
      <div className="flex items-center gap-3 border-b border-black/5 px-4 dark:border-white/10">
        <Search aria-hidden="true" className="size-5 text-ink-soft" />
        <input
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={results[active] ? `${id}-${results[active].id}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onInputKey}
          placeholder={t.searchPlaceholder}
          className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-soft"
        />
      </div>
      <div id={`${id}-list`} role="listbox" aria-label={t.results} className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-ink-soft">{t.noResults}</p>}
        {results.map((tool, i) => (
          <div
            key={tool.id}
            id={`${id}-${tool.id}`}
            role="option"
            tabIndex={-1}
            aria-selected={i === active}
            onClick={() => select(tool)}
            onKeyDown={(e) => e.key === "Enter" && select(tool)}
            onMouseMove={() => setActive(i)}
            className={cx(
              "flex cursor-pointer items-center justify-between rounded-glass-sm px-3 py-2.5",
              i === active && "bg-glass-hover",
            )}
          >
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <tool.icon aria-hidden="true" className="size-[18px] text-ink-soft" />
              {tool.name}
            </span>
            <span className="text-xs text-ink-soft">{CATEGORIES[tool.category].name}</span>
          </div>
        ))}
      </div>
    </dialog>
  )
}

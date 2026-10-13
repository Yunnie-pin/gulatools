import { Check, ChevronDown, type LucideIcon } from "lucide-react"
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react"
import { cx } from "@/lib/cx"
import { glassFieldClass } from "./GlassInput"

export type DropdownOption<T extends string> = {
  value: T
  label: string
  icon?: LucideIcon
}

type DropdownProps<T extends string> = {
  label: string
  value: T
  options: readonly DropdownOption<T>[]
  onChange: (value: T) => void
  className?: string
}

const LIST_MAX_HEIGHT = 288

export function Dropdown<T extends string>({ label, value, options, onChange, className }: DropdownProps<T>) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [upward, setUpward] = useState(false)

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selected = options[selectedIndex]

  const show = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      const below = window.innerHeight - rect.bottom
      setUpward(below < LIST_MAX_HEIGHT + 16 && rect.top > below)
    }
    setActive(selectedIndex)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const choose = (index: number) => {
    const option = options[index]
    if (option) onChange(option.value)
    close()
  }

  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" })
  }, [open, active])

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault()
      show()
    }
  }

  const onListKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const last = options.length - 1
    const move = (index: number) => {
      e.preventDefault()
      setActive(Math.min(last, Math.max(0, index)))
    }
    if (e.key === "ArrowDown") move(active + 1)
    else if (e.key === "ArrowUp") move(active - 1)
    else if (e.key === "Home") move(0)
    else if (e.key === "End") move(last)
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      choose(active)
    } else if (e.key === "Escape") {
      e.preventDefault()
      close()
    } else if (e.key === "Tab") setOpen(false)
    else if (e.key.length === 1) {
      const key = e.key.toLowerCase()
      const ordered = [...options.slice(active + 1), ...options.slice(0, active + 1)]
      const match = ordered.find((option) => option.label.toLowerCase().startsWith(key))
      if (match) setActive(options.indexOf(match))
    }
  }

  return (
    <div ref={rootRef} className={cx("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={onTriggerKeyDown}
        className={cx(glassFieldClass, "inline-flex h-9 w-full cursor-pointer items-center gap-2 pr-2 text-left")}
      >
        {selected?.icon && <selected.icon aria-hidden="true" className="size-4 shrink-0 text-ink-soft" />}
        <span className="grid min-w-0 flex-1">
          {options.map((option) => (
            <span key={option.value} aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
              {option.label}
            </span>
          ))}
          <span className="col-start-1 row-start-1 truncate">{selected?.label}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cx("size-4 shrink-0 text-ink-soft transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKeyDown}
          style={{ maxHeight: LIST_MAX_HEIGHT }}
          className={cx(
            "glass glass-solid absolute z-30 min-w-full animate-[pop-in_.18s_var(--ease)] overflow-y-auto rounded-glass-md p-1.5 outline-none",
            upward ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            return (
              <div
                key={option.value}
                id={`${id}-${index}`}
                data-index={index}
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                onClick={() => choose(index)}
                onKeyDown={onListKeyDown}
                onPointerMove={() => setActive(index)}
                className={cx(
                  "flex cursor-pointer items-center gap-2.5 rounded-glass-sm px-3 py-2 text-sm whitespace-nowrap text-ink",
                  index === active && "bg-glass-hover",
                  isSelected && "font-medium",
                )}
              >
                {option.icon && <option.icon aria-hidden="true" className="size-4 shrink-0 text-ink-soft" />}
                {option.label}
                {isSelected && <Check aria-hidden="true" className="ml-auto size-4 shrink-0 pl-0.5" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

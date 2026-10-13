import type { LucideIcon } from "lucide-react"
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react"
import { cx } from "@/lib/cx"

export type MenuItem = {
  label: string
  icon?: LucideIcon
  onSelect: () => void
}

type GlassMenuProps = {
  label: string
  trigger: ReactNode
  items: MenuItem[]
  triggerClassName?: string
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GlassMenu({
  label,
  trigger,
  items,
  triggerClassName,
  className,
  open: openProp,
  onOpenChange,
}: GlassMenuProps) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [innerOpen, setInnerOpen] = useState(false)
  const open = openProp ?? innerOpen
  const setOpen = useCallback(
    (next: boolean) => {
      setInnerOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange],
  )

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus()
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open, setOpen])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])
    const at = buttons.indexOf(document.activeElement as HTMLElement)
    const focus = (i: number) => {
      e.preventDefault()
      buttons[(i + buttons.length) % buttons.length]?.focus()
    }
    if (e.key === "ArrowDown") focus(at + 1)
    else if (e.key === "ArrowUp") focus(at - 1)
    else if (e.key === "Home") focus(0)
    else if (e.key === "End") focus(buttons.length - 1)
    else if (e.key === "Tab") setOpen(false)
    else if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      <div
        ref={menuRef}
        id={id}
        role="menu"
        aria-label={label}
        data-open={open || undefined}
        inert={!open}
        onKeyDown={onKeyDown}
        className={cx(
          "glass glass-solid pointer-events-none absolute z-30 flex min-w-44 scale-95 flex-col rounded-glass-md p-1.5 opacity-0 transition-[opacity,scale] duration-300 ease-spring data-open:pointer-events-auto data-open:scale-100 data-open:opacity-100",
          className,
        )}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => {
              close()
              item.onSelect()
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-glass-sm px-3 py-2 text-left text-sm text-ink outline-none hover:bg-glass-hover focus-visible:bg-glass-hover"
          >
            {item.icon && <item.icon aria-hidden="true" className="size-4 text-ink-soft" />}
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}

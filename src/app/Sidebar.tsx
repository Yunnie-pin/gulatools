import { Menu, Pin, PinOff, Search, X } from "lucide-react"
import { type FocusEvent, type PointerEvent, useEffect, useRef, useState } from "react"
import { NavLink } from "react-router"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Logo } from "@/components/Logo"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { cx } from "@/lib/cx"
import { openPalette, PALETTE_SHORTCUT } from "@/lib/palette"
import { setSidebarPinned, useSidebarPinned } from "@/lib/sidebar"
import { CATEGORIES, CATEGORY_IDS, type Tool } from "@/lib/tool"
import { useUsage } from "@/lib/usage"
import { resolveTools, toolsByCategory } from "@/tools/registry"
import { ActiveModeIcon, BackgroundPicker, LanguageSwitcher, ThemeSwitcher } from "./ThemeControls"

const REVEAL = "opacity-0 transition-opacity duration-200 group-data-[expanded]/sidebar:opacity-100"

const EXPAND_HEIGHT =
  "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-glass group-data-[expanded]/sidebar:grid-rows-[1fr]"

const HIDE_SCROLLBAR =
  "[scrollbar-width:none] group-data-[expanded]/sidebar:[scrollbar-width:thin] [&::-webkit-scrollbar]:hidden group-data-[expanded]/sidebar:[&::-webkit-scrollbar]:block"

type SidebarContentProps = {
  collapsible?: boolean
  onNavigate?: () => void
}

type NavSectionProps = {
  title: string
  tools: Tool[]
  reveal?: string
  onNavigate?: () => void
}

function NavSection({ title, tools, reveal, onNavigate }: NavSectionProps) {
  return (
    <section className="mb-4">
      <h2
        className={cx(
          "mb-1 px-[13px] text-xs font-medium tracking-wide whitespace-nowrap text-ink-soft uppercase",
          reveal,
        )}
      >
        {title}
      </h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            <NavLink
              to={`/${tool.id}`}
              title={tool.name}
              onClick={onNavigate}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 rounded-glass-sm px-[13px] py-2 text-sm transition duration-200 ease-glass",
                  isActive ? "bg-glass-hover font-medium" : "text-ink-soft hover:bg-glass-hover hover:text-ink",
                )
              }
            >
              <tool.icon aria-hidden="true" className="size-[18px] shrink-0" />
              <span className={cx("whitespace-nowrap", reveal)}>{tool.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SidebarContent({ collapsible = false, onNavigate }: SidebarContentProps) {
  const reveal = collapsible ? REVEAL : undefined
  const favorites = resolveTools(useUsage().favorites)
  const t = useMessages(ui).shell

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          openPalette()
        }}
        className={glassButtonClass("frost", "w-full shrink-0 justify-start gap-3 px-[13px] text-ink-soft")}
      >
        <Search aria-hidden="true" className="size-[18px] shrink-0" />
        <span className={cx("whitespace-nowrap", reveal)}>{t.searchPlaceholder}</span>
        <kbd className={cx("ml-auto hidden font-mono text-xs whitespace-nowrap lg:inline", reveal)}>
          {PALETTE_SHORTCUT}
        </kbd>
      </button>

      <nav
        aria-label="Tools"
        className={cx("-mx-1 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1", collapsible && HIDE_SCROLLBAR)}
      >
        {favorites.length > 0 && (
          <NavSection title={t.favorites} tools={favorites} reveal={reveal} onNavigate={onNavigate} />
        )}
        {CATEGORY_IDS.filter((id) => toolsByCategory[id].length).map((id) => (
          <NavSection
            key={id}
            title={CATEGORIES[id].name}
            tools={toolsByCategory[id]}
            reveal={reveal}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="flex shrink-0 flex-col gap-3">
        <div className="relative">
          {collapsible && (
            <ActiveModeIcon className="transition-opacity duration-200 group-data-[expanded]/sidebar:opacity-0" />
          )}
          <ThemeSwitcher className={reveal} />
        </div>
        <div className={collapsible ? EXPAND_HEIGHT : undefined}>
          <div className={cx("flex min-h-0 flex-col gap-3 overflow-hidden", reveal)}>
            <LanguageSwitcher />
            <BackgroundPicker />
          </div>
        </div>
      </div>
    </>
  )
}

const OPEN_DELAY_MS = 150
const CLOSE_DELAY_MS = 200

function useHoverIntent() {
  const [hovered, setHovered] = useState(false)
  const timer = useRef(0)
  const target = useRef(false)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const schedule = (next: boolean, delay: number) => {
    if (target.current === next) return
    target.current = next
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHovered(next), delay)
  }

  const open = (e: PointerEvent) => {
    if (e.pointerType === "mouse") schedule(true, OPEN_DELAY_MS)
  }

  return {
    hovered,
    onPointerEnter: open,
    onPointerMove: open,
    onPointerLeave: () => schedule(false, CLOSE_DELAY_MS),
  }
}

function useKeyboardFocusWithin() {
  const [focused, setFocused] = useState(false)
  return {
    focused,
    onFocus: (e: FocusEvent) => setFocused(e.target.matches(":focus-visible")),
    onBlur: (e: FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
    },
  }
}

function DesktopSidebar() {
  const pinned = useSidebarPinned()
  const { hovered, ...hoverHandlers } = useHoverIntent()
  const { focused, ...focusHandlers } = useKeyboardFocusWithin()
  const expanded = pinned || hovered || focused
  const PinIcon = pinned ? PinOff : Pin
  const t = useMessages(ui).shell

  return (
    <aside
      data-expanded={expanded || undefined}
      className="group/sidebar relative z-40 hidden lg:sticky lg:top-4 lg:block lg:h-[calc(100dvh-2rem)]"
      {...hoverHandlers}
      {...focusHandlers}
    >
      <GlassPanel
        variant="strong"
        className="absolute inset-y-0 left-0 flex w-[76px] flex-col gap-5 overflow-hidden p-4 transition-[width] duration-300 ease-glass group-data-[expanded]/sidebar:w-[264px]"
      >
        <div className="flex items-center justify-between gap-2 px-[6px]">
          <Logo labelClassName={REVEAL} />
          <button
            type="button"
            aria-pressed={pinned}
            aria-label={pinned ? t.unpinLong : t.pinLong}
            title={pinned ? t.unpin : t.pin}
            onClick={() => setSidebarPinned(!pinned)}
            className={cx(glassButtonClass("frost", "size-8 shrink-0 px-0"), REVEAL)}
          >
            <PinIcon aria-hidden="true" className="size-4" />
          </button>
        </div>
        <SidebarContent collapsible />
      </GlassPanel>
    </aside>
  )
}

function MobileSidebar() {
  const drawerRef = useRef<HTMLDialogElement>(null)
  const close = () => drawerRef.current?.close()
  const t = useMessages(ui).shell

  return (
    <>
      <GlassPanel
        variant="strong"
        className="sticky top-2 z-30 flex items-center justify-between gap-3 px-4 py-3 lg:hidden"
      >
        <Logo />
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={t.searchTool}
            onClick={openPalette}
            className={glassButtonClass("frost", "w-9 px-0")}
          >
            <Search aria-hidden="true" className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label={t.openMenu}
            onClick={() => drawerRef.current?.showModal()}
            className={glassButtonClass("frost", "w-9 px-0")}
          >
            <Menu aria-hidden="true" className="size-[18px]" />
          </button>
        </div>
      </GlassPanel>

      <dialog
        ref={drawerRef}
        aria-label={t.menu}
        className="glass glass-strong m-0 h-dvh max-h-dvh w-[min(300px,85vw)] rounded-none rounded-r-glass p-0 text-ink backdrop:bg-black/40 open:animate-[drawer-in_.3s_var(--ease)] lg:hidden"
      >
        <div className="flex h-full flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
            <Logo onClick={close} />
            <button
              type="button"
              aria-label={t.closeMenu}
              onClick={close}
              className={glassButtonClass("frost", "w-9 px-0")}
            >
              <X aria-hidden="true" className="size-[18px]" />
            </button>
          </div>
          <SidebarContent onNavigate={close} />
        </div>
      </dialog>
    </>
  )
}

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

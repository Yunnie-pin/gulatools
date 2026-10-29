import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router"
import { Backdrop } from "@/components/glass/Backdrop"
import { Toaster } from "@/components/glass/Toaster"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { cx } from "@/lib/cx"
import { useSidebarPinned } from "@/lib/sidebar"
import { AboutDialog } from "./AboutDialog"
import { CommandPalette } from "./CommandPalette"
import { LanguageHint } from "./LanguageHint"
import { Sidebar } from "./Sidebar"

function useFocusOnNavigation() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const previous = useRef(pathname)

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [pathname])

  return mainRef
}

export function Layout() {
  const pinned = useSidebarPinned()
  const mainRef = useFocusOnNavigation()
  const t = useMessages(ui).shell

  return (
    <>
      <a
        href="#content"
        className="glass fixed top-3 left-3 z-[60] -translate-y-20 rounded-glass-sm px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        {t.skipToContent}
      </a>
      <Backdrop />
      <div
        className={cx(
          "mx-auto flex min-h-dvh max-w-[1600px] flex-col gap-4 p-4 lg:grid lg:transition-[grid-template-columns] lg:duration-300",
          pinned ? "lg:grid-cols-[264px_1fr]" : "lg:grid-cols-[76px_1fr]",
        )}
      >
        <Sidebar />
        <main ref={mainRef} id="content" tabIndex={-1} className="flex min-w-0 flex-1 flex-col outline-none">
          <LanguageHint />
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <AboutDialog />
      <Toaster />
    </>
  )
}

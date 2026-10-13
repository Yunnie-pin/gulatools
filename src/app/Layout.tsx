import { Outlet } from "react-router"
import { Backdrop } from "@/components/glass/Backdrop"
import { Toaster } from "@/components/glass/Toaster"
import { cx } from "@/lib/cx"
import { useSidebarPinned } from "@/lib/sidebar"
import { CommandPalette } from "./CommandPalette"
import { Sidebar } from "./Sidebar"

export function Layout() {
  const pinned = useSidebarPinned()

  return (
    <>
      <Backdrop />
      <div
        className={cx(
          "mx-auto flex min-h-dvh max-w-[1600px] flex-col gap-4 p-4 lg:grid lg:transition-[grid-template-columns] lg:duration-300",
          pinned ? "lg:grid-cols-[264px_1fr]" : "lg:grid-cols-[76px_1fr]",
        )}
      >
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <Toaster />
    </>
  )
}

import { createPersistentStore } from "./store"

const pinned = createPersistentStore(
  "gulatools:sidebar-pinned",
  () => window.matchMedia("(min-width: 1536px)").matches,
  (raw) => (typeof raw === "boolean" ? raw : undefined),
)

export const setSidebarPinned = pinned.set

export const useSidebarPinned = pinned.use

import { Dices } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const uuid: Tool = {
  id: "uuid",
  name: "UUID / ULID",
  short: "v4 · v7 · ULID",
  description: "Generate UUID v4, UUID v7 yang terurut waktu, atau ULID secara massal.",
  category: "crypto",
  keywords: ["uuid", "guid", "ulid", "v4", "v7", "id", "random", "generate"],
  icon: Dices,
  Component: lazy(() => import("./Tool")),
}

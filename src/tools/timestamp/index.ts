import { Clock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const timestamp: Tool = {
  id: "timestamp",
  name: "Timestamp",
  short: "Unix · Tanggal",
  description: "Konversi Unix timestamp (detik sampai nanodetik) ke tanggal yang mudah dibaca, dan sebaliknya.",
  category: "converter",
  keywords: ["timestamp", "unix", "epoch", "date", "time", "iso", "tanggal", "waktu"],
  icon: Clock,
  Component: lazy(() => import("./Tool")),
}

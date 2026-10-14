import { Clock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const timestamp: Tool = {
  id: "timestamp",
  name: "Timestamp",
  short: { id: "Unix · Tanggal", en: "Unix · Date" },
  description: {
    id: "Konversi Unix timestamp (detik sampai nanodetik) ke tanggal yang mudah dibaca, dan sebaliknya.",
    en: "Convert Unix timestamps (seconds to nanoseconds) into readable dates, and back.",
  },
  category: "converter",
  keywords: ["timestamp", "unix", "epoch", "date", "time", "iso", "tanggal", "waktu"],
  icon: Clock,
  Component: lazy(() => import("./Tool")),
}

import { CalendarClock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const cron: Tool = {
  id: "cron",
  name: "Cron Parser",
  short: "Jadwal ke teks",
  description: "Terjemahkan ekspresi cron ke bahasa manusia dan lihat 10 jadwal berikutnya.",
  category: "converter",
  keywords: ["cron", "crontab", "schedule", "jadwal", "job", "scheduler"],
  icon: CalendarClock,
  Component: lazy(() => import("./Tool")),
}

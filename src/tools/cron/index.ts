import { CalendarClock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const cron: Tool = {
  id: "cron",
  name: "Cron Parser",
  short: { id: "Jadwal ke teks", en: "Schedule to text" },
  description: {
    id: "Terjemahkan ekspresi cron ke bahasa manusia dan lihat 10 jadwal berikutnya.",
    en: "Translate cron expressions into plain language and see the next 10 runs.",
  },
  category: "converter",
  keywords: ["cron", "crontab", "schedule", "jadwal", "job", "scheduler"],
  icon: CalendarClock,
  Component: lazy(() => import("./Tool")),
}

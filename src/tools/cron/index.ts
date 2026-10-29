import { CalendarClock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const cron: Tool = {
  id: "cron",
  name: "Cron Parser",
  short: { id: "Jadwal ke teks", en: "Schedule to text", ja: "スケジュールを文章に" },
  description: {
    id: "Terjemahkan ekspresi cron ke bahasa manusia dan lihat 10 jadwal berikutnya.",
    en: "Translate cron expressions into plain language and see the next 10 runs.",
    ja: "cron 式を自然な文章に変換し、次の 10 回の実行日時を表示します。",
  },
  category: "converter",
  keywords: ["cron", "crontab", "schedule", "jadwal", "job", "scheduler"],
  icon: CalendarClock,
  Component: lazy(() => import("./Tool")),
}

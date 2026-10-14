import { defineMessages } from "@/i18n/locale"
import type { CronPreset } from "./logic"

export const messages = defineMessages(
  {
    expression: "Ekspresi cron",
    fields: ["menit", "jam", "tanggal", "bulan", "hari"],
    nextRuns: "10 jadwal berikutnya (waktu lokal)",
    presets: {
      "* * * * *": "Tiap menit",
      "*/5 * * * *": "Tiap 5 menit",
      "0 * * * *": "Tiap jam",
      "0 0 * * *": "Tiap tengah malam",
      "0 9 * * 1-5": "Hari kerja 09:00",
      "0 0 1 * *": "Awal bulan",
    } satisfies Record<CronPreset, string>,
  },
  {
    expression: "Cron expression",
    fields: ["minute", "hour", "day", "month", "weekday"],
    nextRuns: "Next 10 runs (local time)",
    presets: {
      "* * * * *": "Every minute",
      "*/5 * * * *": "Every 5 minutes",
      "0 * * * *": "Every hour",
      "0 0 * * *": "Every midnight",
      "0 9 * * 1-5": "Weekdays 09:00",
      "0 0 1 * *": "Start of month",
    },
  },
)

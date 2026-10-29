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
  {
    expression: "cron 式",
    fields: ["分", "時", "日", "月", "曜日"],
    nextRuns: "次の 10 回の実行（ローカル時刻）",
    presets: {
      "* * * * *": "毎分",
      "*/5 * * * *": "5 分ごと",
      "0 * * * *": "毎時",
      "0 0 * * *": "毎日 0 時",
      "0 9 * * 1-5": "平日 9:00",
      "0 0 1 * *": "毎月 1 日",
    },
  },
)

import { CronExpressionParser } from "cron-parser"
import cronstrue from "cronstrue"
import "cronstrue/locales/id"
import { errorMessage } from "@/lib/result"

export const PRESETS = [
  { expression: "* * * * *", label: "Tiap menit" },
  { expression: "*/5 * * * *", label: "Tiap 5 menit" },
  { expression: "0 * * * *", label: "Tiap jam" },
  { expression: "0 0 * * *", label: "Tiap tengah malam" },
  { expression: "0 9 * * 1-5", label: "Hari kerja 09:00" },
  { expression: "0 0 1 * *", label: "Awal bulan" },
] as const

export type CronInfo = {
  description: string
  nextRuns: Date[]
}

export function explainCron(expression: string, count = 10, from = new Date()): CronInfo {
  const trimmed = expression.trim()
  try {
    return {
      description: cronstrue.toString(trimmed, { locale: "id", use24HourTimeFormat: true }),
      nextRuns: CronExpressionParser.parse(trimmed, { currentDate: from })
        .take(count)
        .map((date) => date.toDate()),
    }
  } catch (error) {
    throw new Error(`Ekspresi cron tidak valid: ${errorMessage(error).replace(/^Error:\s*/, "")}`)
  }
}

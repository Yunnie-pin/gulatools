import { CronExpressionParser } from "cron-parser"
import cronstrue from "cronstrue"
import { LocalizedError } from "@/i18n/errors"
import type { Locale } from "@/i18n/locale"
import "cronstrue/locales/id"
import { errorMessage } from "@/lib/result"

export const PRESETS = ["* * * * *", "*/5 * * * *", "0 * * * *", "0 0 * * *", "0 9 * * 1-5", "0 0 1 * *"] as const

export type CronPreset = (typeof PRESETS)[number]

type ExplainOptions = { locale?: Locale; count?: number; from?: Date }

export type CronInfo = {
  description: string
  nextRuns: Date[]
}

export function explainCron(
  expression: string,
  { locale = "id", count = 10, from = new Date() }: ExplainOptions = {},
): CronInfo {
  const trimmed = expression.trim()
  try {
    return {
      description: cronstrue.toString(trimmed, { locale, use24HourTimeFormat: true }),
      nextRuns: CronExpressionParser.parse(trimmed, { currentDate: from })
        .take(count)
        .map((date) => date.toDate()),
    }
  } catch (error) {
    throw new LocalizedError("invalidCron", errorMessage(error).replace(/^Error:\s*/, ""))
  }
}

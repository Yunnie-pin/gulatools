import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    language: "Bahasa",
    saved: (before: number, after: number, percent: number) => `${before} → ${after} byte (−${percent}%)`,
  },
  {
    language: "Language",
    saved: (before, after, percent) => `${before} → ${after} bytes (−${percent}%)`,
  },
  {
    language: "言語",
    saved: (before, after, percent) => `${before} → ${after} バイト（−${percent}%）`,
  },
)

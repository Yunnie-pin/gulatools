import { defineMessages } from "@/i18n/locale"
import type { LoremUnit } from "./logic"

export const messages = defineMessages(
  {
    unit: "Satuan",
    units: { paragraphs: "Paragraf", sentences: "Kalimat", words: "Kata" } satisfies Record<LoremUnit, string>,
    count: "Jumlah",
    classic: "Mulai dengan Lorem ipsum",
    result: "Lorem ipsum",
  },
  {
    unit: "Unit",
    units: { paragraphs: "Paragraphs", sentences: "Sentences", words: "Words" },
    count: "Count",
    classic: "Start with Lorem ipsum",
    result: "Lorem ipsum",
  },
)

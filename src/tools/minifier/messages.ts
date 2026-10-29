import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    jsComment: "Hitung total belanja",
    cssComment: "Kartu kaca",
    language: "Bahasa",
    saved: (before: number, after: number, percent: number) => `${before} → ${after} byte (−${percent}%)`,
  },
  {
    jsComment: "Calculate the cart total",
    cssComment: "Glass card",
    language: "Language",
    saved: (before, after, percent) => `${before} → ${after} bytes (−${percent}%)`,
  },
  {
    jsComment: "カートの合計金額を計算",
    cssComment: "ガラス風カード",
    language: "言語",
    saved: (before, after, percent) => `${before} → ${after} バイト（−${percent}%）`,
  },
)

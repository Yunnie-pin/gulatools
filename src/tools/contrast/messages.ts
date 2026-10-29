import { defineMessages } from "@/i18n/locale"
import type { CheckId } from "./logic"

export const messages = defineMessages(
  {
    foreground: "Warna teks",
    background: "Warna latar",
    pick: (label: string) => `Pilih ${label.toLowerCase()}`,
    swap: "Tukar warna",
    ratio: "Rasio kontras",
    pass: "Lulus",
    fail: "Gagal",
    checks: {
      aaNormal: "Teks normal",
      aaLarge: "Teks besar",
      aaaNormal: "Teks normal",
      aaaLarge: "Teks besar",
      nonText: "Komponen UI & grafik",
    } satisfies Record<CheckId, string>,
    sampleNormal: "Gula manis, kopi pahit. Teks normal 16px.",
    sampleLarge: "Teks besar 24px",
  },
  {
    foreground: "Text color",
    background: "Background color",
    pick: (label: string) => `Pick ${label.toLowerCase()}`,
    swap: "Swap colors",
    ratio: "Contrast ratio",
    pass: "Pass",
    fail: "Fail",
    checks: {
      aaNormal: "Normal text",
      aaLarge: "Large text",
      aaaNormal: "Normal text",
      aaaLarge: "Large text",
      nonText: "UI components & graphics",
    },
    sampleNormal: "Sweet sugar, bitter coffee. Normal 16px text.",
    sampleLarge: "Large 24px text",
  },
  {
    foreground: "文字色",
    background: "背景色",
    pick: (label) => `${label}を選ぶ`,
    swap: "色を入れ替え",
    ratio: "コントラスト比",
    pass: "合格",
    fail: "不合格",
    checks: {
      aaNormal: "通常のテキスト",
      aaLarge: "大きなテキスト",
      aaaNormal: "通常のテキスト",
      aaaLarge: "大きなテキスト",
      nonText: "UI コンポーネントと図",
    },
    sampleNormal: "甘い砂糖、苦いコーヒー。16px の通常テキスト。",
    sampleLarge: "24px の大きなテキスト",
  },
)

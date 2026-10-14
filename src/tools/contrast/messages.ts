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
)

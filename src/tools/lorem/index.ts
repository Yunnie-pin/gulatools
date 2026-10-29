import { Pilcrow } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const lorem: Tool = {
  id: "lorem",
  name: "Lorem Ipsum",
  short: { id: "Paragraf · Kalimat · Kata", en: "Paragraphs · Sentences · Words", ja: "段落 · 文 · 単語" },
  description: {
    id: "Buat teks placeholder Lorem ipsum dalam jumlah paragraf, kalimat, atau kata yang kamu tentukan.",
    en: "Generate Lorem ipsum placeholder text by paragraphs, sentences, or words.",
    ja: "段落・文・単語の数を指定して Lorem ipsum のダミーテキストを生成します。",
  },
  category: "generator",
  keywords: ["lorem", "ipsum", "placeholder", "dummy", "text", "filler", "teks", "contoh"],
  icon: Pilcrow,
  Component: lazy(() => import("./Tool")),
}

import { Diff } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const diff: Tool = {
  id: "diff",
  name: "Text Diff",
  short: { id: "Baris · Kata · Karakter", en: "Line · Word · Char", ja: "行 · 単語 · 文字" },
  description: {
    id: "Bandingkan dua teks dan lihat bagian yang ditambah atau dihapus. Salin hasilnya sebagai unified patch.",
    en: "Compare two texts and see what was added or removed. Copy the result as a unified patch.",
    ja: "2 つのテキストを比較し、追加・削除された部分を表示します。結果は unified パッチとしてコピーできます。",
  },
  category: "text",
  keywords: ["diff", "compare", "bandingkan", "patch", "perbedaan", "changes"],
  icon: Diff,
  Component: lazy(() => import("./Tool")),
}

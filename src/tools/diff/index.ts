import { Diff } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const diff: Tool = {
  id: "diff",
  name: "Text Diff",
  short: { id: "Baris · Kata · Karakter", en: "Line · Word · Char" },
  description: {
    id: "Bandingkan dua teks dan lihat bagian yang ditambah atau dihapus. Salin hasilnya sebagai unified patch.",
    en: "Compare two texts and see what was added or removed. Copy the result as a unified patch.",
  },
  category: "text",
  keywords: ["diff", "compare", "bandingkan", "patch", "perbedaan", "changes"],
  icon: Diff,
  Component: lazy(() => import("./Tool")),
}

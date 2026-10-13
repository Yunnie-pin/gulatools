import { Diff } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const diff: Tool = {
  id: "diff",
  name: "Text Diff",
  short: "Baris · Kata · Karakter",
  description: "Bandingkan dua teks dan lihat bagian yang ditambah atau dihapus. Salin hasilnya sebagai unified patch.",
  category: "text",
  keywords: ["diff", "compare", "bandingkan", "patch", "perbedaan", "changes"],
  icon: Diff,
  Component: lazy(() => import("./Tool")),
}

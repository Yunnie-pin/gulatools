import { ArrowDownAZ } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const sortLines: Tool = {
  id: "sort-lines",
  name: "Sort & Dedupe Lines",
  short: "Sort · Unique · Shuffle",
  description: {
    id: "Urutkan baris secara alami (A–Z, Z–A), hapus duplikat, balik, atau acak urutan, lengkap dengan trim dan buang baris kosong.",
    en: "Sort lines naturally (A–Z, Z–A), remove duplicates, reverse, or shuffle them, with trimming and empty-line removal.",
    ja: "行を自然順（A–Z、Z–A）に並べ替え、重複の削除、逆順、シャッフルができます。空白の除去や空行の削除にも対応。",
  },
  category: "text",
  keywords: ["sort", "lines", "unique", "dedupe", "duplicate", "shuffle", "random", "reverse", "urutkan", "baris"],
  icon: ArrowDownAZ,
  Component: lazy(() => import("./Tool")),
}

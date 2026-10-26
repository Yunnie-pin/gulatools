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
  },
  category: "text",
  keywords: ["sort", "lines", "unique", "dedupe", "duplicate", "shuffle", "random", "reverse", "urutkan", "baris"],
  icon: ArrowDownAZ,
  Component: lazy(() => import("./Tool")),
}

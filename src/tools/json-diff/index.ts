import { FileDiff } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jsonDiff: Tool = {
  id: "json-diff",
  name: "JSON Diff",
  short: "Structural compare",
  description: {
    id: "Bandingkan dua dokumen JSON secara struktural: lihat key yang ditambah, dihapus, atau diubah beserta path-nya, tanpa terpengaruh urutan key.",
    en: "Compare two JSON documents structurally: see added, removed, or changed keys with their paths, regardless of key order.",
  },
  category: "text",
  keywords: ["json", "diff", "compare", "difference", "bandingkan", "structural", "object"],
  icon: FileDiff,
  Component: lazy(() => import("./Tool")),
}

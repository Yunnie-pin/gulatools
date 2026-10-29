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
    ja: "2 つの JSON を構造で比較し、追加・削除・変更されたキーをパス付きで表示します。キーの順序は無視します。",
  },
  category: "text",
  keywords: ["json", "diff", "compare", "difference", "bandingkan", "structural", "object"],
  icon: FileDiff,
  Component: lazy(() => import("./Tool")),
}

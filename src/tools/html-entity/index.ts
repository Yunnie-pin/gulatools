import { CodeXml } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const htmlEntity: Tool = {
  id: "html-entity",
  name: "HTML Entity",
  short: "Encode · Decode",
  description: {
    id: "Escape karakter khusus HTML menjadi entity, dan decode entity bernama maupun numerik kembali ke teks.",
    en: "Escape special HTML characters into entities, and decode named or numeric entities back to text.",
    ja: "HTML の特殊文字をエンティティにエスケープし、名前付き・数値エンティティをテキストに戻します。",
  },
  category: "encoder",
  keywords: ["html", "entity", "entities", "escape", "unescape", "encode", "decode", "amp", "xss"],
  icon: CodeXml,
  Component: lazy(() => import("./Tool")),
}

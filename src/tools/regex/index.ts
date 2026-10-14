import { Regex } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const regex: Tool = {
  id: "regex",
  name: "Regex Tester",
  short: "Match · Replace",
  description: {
    id: "Uji regular expression JavaScript: lihat semua match, grup, dan hasil replace secara langsung.",
    en: "Test JavaScript regular expressions: see every match, group, and replacement live.",
  },
  category: "text",
  keywords: ["regex", "regexp", "regular expression", "match", "replace", "pattern"],
  icon: Regex,
  Component: lazy(() => import("./Tool")),
}

import { Regex } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const regex: Tool = {
  id: "regex",
  name: "Regex Tester",
  short: "Match · Replace",
  description: "Uji regular expression JavaScript: lihat semua match, grup, dan hasil replace secara langsung.",
  category: "text",
  keywords: ["regex", "regexp", "regular expression", "match", "replace", "pattern"],
  icon: Regex,
  Component: lazy(() => import("./Tool")),
}

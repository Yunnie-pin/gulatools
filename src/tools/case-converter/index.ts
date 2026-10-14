import { CaseSensitive } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const caseConverter: Tool = {
  id: "case-converter",
  name: "Case Converter",
  short: "camel · snake · kebab",
  description: {
    id: "Ubah teks ke camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dan lainnya.",
    en: "Convert text to camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more.",
  },
  category: "text",
  keywords: ["case", "camel", "pascal", "snake", "kebab", "constant", "title", "uppercase", "lowercase"],
  icon: CaseSensitive,
  Component: lazy(() => import("./Tool")),
}

import { ListFilter } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jsonPath: Tool = {
  id: "jsonpath",
  name: "JSONPath",
  short: "Query JSON",
  description: {
    id: "Ambil data dari JSON dengan ekspresi JSONPath, termasuk wildcard, recursive descent, dan filter.",
    en: "Query JSON with JSONPath expressions, including wildcards, recursive descent, and filters.",
  },
  category: "converter",
  keywords: ["jsonpath", "json", "query", "filter", "select", "jq", "path"],
  icon: ListFilter,
  Component: lazy(() => import("./Tool")),
}

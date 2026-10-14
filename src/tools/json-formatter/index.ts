import { Braces } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jsonFormatter: Tool = {
  id: "json-formatter",
  name: "JSON Formatter",
  short: "Format · Minify",
  description: {
    id: "Rapikan, minify, dan validasi JSON.",
    en: "Format, minify, and validate JSON.",
  },
  category: "formatter",
  keywords: ["json", "beautify", "prettify", "minify", "validate"],
  icon: Braces,
  Component: lazy(() => import("./Tool")),
}

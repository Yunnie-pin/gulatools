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
    ja: "JSON の整形、圧縮、検証を行います。",
  },
  category: "formatter",
  keywords: ["json", "beautify", "prettify", "minify", "validate"],
  icon: Braces,
  Component: lazy(() => import("./Tool")),
}

import { Code } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const codeFormatter: Tool = {
  id: "code-formatter",
  name: "Code Formatter",
  short: "Prettier",
  description: {
    id: "Rapikan JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, YAML, dan XML dengan Prettier.",
    en: "Format JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, YAML, and XML with Prettier.",
  },
  category: "formatter",
  keywords: [
    "prettier",
    "format",
    "beautify",
    "javascript",
    "typescript",
    "css",
    "scss",
    "html",
    "markdown",
    "graphql",
    "yaml",
    "xml",
  ],
  icon: Code,
  Component: lazy(() => import("./Tool")),
}

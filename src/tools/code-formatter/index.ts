import { Code } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const codeFormatter: Tool = {
  id: "code-formatter",
  name: "Code Formatter",
  short: "Prettier",
  description: "Rapikan JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, dan YAML dengan Prettier.",
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
  ],
  icon: Code,
  Component: lazy(() => import("./Tool")),
}

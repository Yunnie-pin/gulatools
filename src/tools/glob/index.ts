import { FolderSearch } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const glob: Tool = {
  id: "glob",
  name: "Glob Tester",
  short: "**/*.ts · !exclude",
  description: {
    id: "Uji pola glob seperti src/**/*.ts terhadap daftar path, lengkap dengan pengecualian !, brace, dan regex hasil kompilasinya.",
    en: "Test glob patterns such as src/**/*.ts against a list of paths, with ! exclusions, braces, and the compiled regex.",
  },
  category: "text",
  keywords: ["glob", "pattern", "wildcard", "minimatch", "picomatch", "gitignore", "path", "match"],
  icon: FolderSearch,
  Component: lazy(() => import("./Tool")),
}

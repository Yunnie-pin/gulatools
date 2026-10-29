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
    ja: "src/**/*.ts のような glob パターンをパスの一覧に対してテストします。! による除外、ブレース展開、コンパイル後の正規表現も表示。",
  },
  category: "text",
  keywords: ["glob", "pattern", "wildcard", "minimatch", "picomatch", "gitignore", "path", "match"],
  icon: FolderSearch,
  Component: lazy(() => import("./Tool")),
}

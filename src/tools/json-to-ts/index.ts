import { FileType } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jsonToTs: Tool = {
  id: "json-to-ts",
  name: "JSON to TypeScript",
  short: "Interface · Zod",
  description: {
    id: "Buat interface TypeScript atau schema Zod dari contoh JSON, termasuk field opsional dan nullable.",
    en: "Generate TypeScript interfaces or Zod schemas from sample JSON, including optional and nullable fields.",
    ja: "サンプル JSON から TypeScript のインターフェースや Zod スキーマを生成します。省略可能・null 許容のフィールドにも対応。",
  },
  category: "converter",
  keywords: ["json", "typescript", "interface", "type", "zod", "schema", "quicktype", "generate"],
  icon: FileType,
  Component: lazy(() => import("./Tool")),
}

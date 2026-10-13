import { FileType } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jsonToTs: Tool = {
  id: "json-to-ts",
  name: "JSON to TypeScript",
  short: "Interface · Zod",
  description: "Buat interface TypeScript atau schema Zod dari contoh JSON, termasuk field opsional dan nullable.",
  category: "converter",
  keywords: ["json", "typescript", "interface", "type", "zod", "schema", "quicktype", "generate"],
  icon: FileType,
  Component: lazy(() => import("./Tool")),
}

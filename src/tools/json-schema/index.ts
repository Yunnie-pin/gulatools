import { FileCheck } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jsonSchema: Tool = {
  id: "json-schema",
  name: "JSON Schema Validator",
  short: "Draft 7 · 2019-09 · 2020-12",
  description: {
    id: "Validasi JSON terhadap JSON Schema (draft-07, 2019-09, 2020-12) dan lihat semua error beserta lokasinya.",
    en: "Validate JSON against a JSON Schema (draft-07, 2019-09, 2020-12) and see every error with its location.",
  },
  category: "formatter",
  keywords: ["json", "schema", "validate", "validator", "validasi", "ajv", "draft", "openapi"],
  icon: FileCheck,
  Component: lazy(() => import("./Tool")),
}

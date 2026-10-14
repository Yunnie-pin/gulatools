import { Binary } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const numberBase: Tool = {
  id: "number-base",
  name: "Number Base",
  short: "Bin · Oct · Dec · Hex",
  description: {
    id: "Konversi bilangan antara biner, oktal, desimal, dan heksadesimal tanpa batas presisi, lengkap dengan two's complement.",
    en: "Convert numbers between binary, octal, decimal, and hexadecimal with arbitrary precision, including two's complement.",
  },
  category: "converter",
  keywords: ["number", "base", "radix", "binary", "octal", "decimal", "hex", "bilangan", "biner", "basis"],
  icon: Binary,
  Component: lazy(() => import("./Tool")),
}

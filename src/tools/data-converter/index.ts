import { ArrowLeftRight } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const dataConverter: Tool = {
  id: "data-converter",
  name: "Data Converter",
  short: "JSON · YAML · TOML · XML · CSV",
  description: "Konversi data antar JSON, YAML, TOML, XML, dan CSV ke segala arah.",
  category: "converter",
  keywords: ["json", "yaml", "yml", "toml", "xml", "csv", "convert", "config"],
  icon: ArrowLeftRight,
  Component: lazy(() => import("./Tool")),
}

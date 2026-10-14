import { Shapes } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const svgOptimizer: Tool = {
  id: "svg-optimizer",
  name: "SVG Optimizer",
  short: "SVGO · Minify",
  description: {
    id: "Perkecil file SVG dengan SVGO: buang metadata editor, rapikan path, dan bulatkan angka, lengkap dengan pratinjau.",
    en: "Shrink SVG files with SVGO: strip editor metadata, simplify paths, and round numbers, with a preview.",
  },
  category: "formatter",
  keywords: ["svg", "svgo", "optimize", "minify", "compress", "icon", "vector", "kompres", "ikon"],
  icon: Shapes,
  Component: lazy(() => import("./Tool")),
}

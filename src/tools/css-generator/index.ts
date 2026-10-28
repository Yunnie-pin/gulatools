import { Paintbrush } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const cssGenerator: Tool = {
  id: "css-generator",
  name: "CSS Generator",
  short: "Gradient · Shadow · Glass",
  description: {
    id: "Buat CSS gradient, box-shadow berlapis, dan efek glassmorphism dengan pratinjau langsung, lalu salin kodenya.",
    en: "Build CSS gradients, layered box-shadows, and glassmorphism effects with a live preview, then copy the code.",
  },
  category: "generator",
  keywords: ["css", "gradient", "box-shadow", "shadow", "glassmorphism", "glass", "backdrop-filter", "generator"],
  icon: Paintbrush,
  Component: lazy(() => import("./Tool")),
}

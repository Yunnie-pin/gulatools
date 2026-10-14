import { Palette } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const color: Tool = {
  id: "color",
  name: "Color Converter",
  short: "HEX · RGB · HSL · OKLCH",
  description: {
    id: "Konversi warna antar HEX, RGB, HSL, dan OKLCH, lengkap dengan cek kontras WCAG.",
    en: "Convert colors between HEX, RGB, HSL, and OKLCH, with a WCAG contrast check.",
  },
  category: "converter",
  keywords: ["color", "warna", "hex", "rgb", "hsl", "oklch", "contrast", "wcag"],
  icon: Palette,
  Component: lazy(() => import("./Tool")),
}

import { Contrast } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const contrast: Tool = {
  id: "contrast",
  name: "Contrast Checker",
  short: "WCAG AA · AAA",
  description: {
    id: "Cek rasio kontras warna teks dan latar terhadap standar WCAG AA dan AAA, lengkap dengan pratinjau.",
    en: "Check the contrast ratio between text and background colors against WCAG AA and AAA, with a preview.",
  },
  category: "converter",
  keywords: ["contrast", "kontras", "wcag", "a11y", "accessibility", "aksesibilitas", "color", "warna", "aa", "aaa"],
  icon: Contrast,
  Component: lazy(() => import("./Tool")),
}

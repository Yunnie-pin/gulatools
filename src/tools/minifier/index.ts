import { Minimize2 } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const minifier: Tool = {
  id: "minifier",
  name: "JS & CSS Minifier",
  short: "Terser · CSSO",
  description: {
    id: "Perkecil JavaScript dengan Terser dan CSS dengan CSSO, lengkap dengan perbandingan ukuran sebelum dan sesudah.",
    en: "Minify JavaScript with Terser and CSS with CSSO, with a before and after size comparison.",
  },
  category: "formatter",
  keywords: ["minify", "minifier", "compress", "uglify", "terser", "csso", "javascript", "css", "js"],
  icon: Minimize2,
  Component: lazy(() => import("./Tool")),
}

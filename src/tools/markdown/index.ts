import { FileText } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const markdownPreview: Tool = {
  id: "markdown",
  name: "Markdown Preview",
  short: "GFM · HTML",
  description: {
    id: "Pratinjau Markdown (GitHub Flavored) secara langsung dan salin HTML hasilnya yang sudah disanitasi. Gambar eksternal tidak dimuat.",
    en: "Preview GitHub Flavored Markdown live and copy the sanitized HTML output. External images are not loaded.",
    ja: "GitHub Flavored Markdown をリアルタイムでプレビューし、サニタイズ済みの HTML をコピーできます。外部画像は読み込みません。",
  },
  category: "formatter",
  keywords: ["markdown", "md", "preview", "pratinjau", "gfm", "html", "readme"],
  icon: FileText,
  Component: lazy(() => import("./Tool")),
}

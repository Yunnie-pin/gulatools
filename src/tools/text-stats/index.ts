import { ScanText } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const textStats: Tool = {
  id: "text-stats",
  name: "Text Stats",
  short: { id: "Hitung · Karakter tersembunyi", en: "Count · Hidden characters" },
  description: {
    id: "Hitung karakter, kata, baris, dan byte, lalu temukan karakter tak terlihat seperti zero-width space atau kontrol bidi.",
    en: "Count characters, words, lines, and bytes, and find hidden characters such as zero-width spaces or bidi controls.",
  },
  category: "text",
  keywords: [
    "text",
    "count",
    "word",
    "character",
    "length",
    "bytes",
    "zero width",
    "invisible",
    "unicode",
    "hitung",
    "kata",
  ],
  icon: ScanText,
  Component: lazy(() => import("./Tool")),
}

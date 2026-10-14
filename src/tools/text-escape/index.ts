import { TextQuote } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const textEscape: Tool = {
  id: "text-escape",
  name: "Text Escape",
  short: "JSON · Regex · Shell · SQL",
  description: {
    id: "Escape teks agar aman dipakai sebagai string JSON, pola regex, argumen shell, atau literal SQL.",
    en: "Escape text so it is safe to use as a JSON string, regex pattern, shell argument, or SQL literal.",
  },
  category: "encoder",
  keywords: ["escape", "unescape", "json", "string", "regex", "shell", "bash", "sql", "quote", "kutip"],
  icon: TextQuote,
  Component: lazy(() => import("./Tool")),
}

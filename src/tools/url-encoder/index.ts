import { Link } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const urlEncoder: Tool = {
  id: "url-encoder",
  name: "URL Encoder",
  short: "Encode · Decode",
  description: {
    id: "Percent-encode dan decode URL atau query string.",
    en: "Percent-encode and decode URLs or query strings.",
    ja: "URL やクエリ文字列をパーセントエンコード・デコードします。",
  },
  category: "encoder",
  keywords: ["url", "uri", "percent", "encode", "decode", "query", "escape"],
  icon: Link,
  Component: lazy(() => import("./Tool")),
}

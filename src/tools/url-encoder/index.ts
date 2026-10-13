import { Link } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const urlEncoder: Tool = {
  id: "url-encoder",
  name: "URL Encoder",
  short: "Encode · Decode",
  description: "Percent-encode dan decode URL atau query string.",
  category: "encoder",
  keywords: ["url", "uri", "percent", "encode", "decode", "query", "escape"],
  icon: Link,
  Component: lazy(() => import("./Tool")),
}

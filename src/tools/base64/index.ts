import { Binary } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const base64: Tool = {
  id: "base64",
  name: "Base64",
  short: "Encode · Decode",
  description: "Encode dan decode Base64, termasuk varian URL-safe. Aman untuk teks Unicode.",
  category: "encoder",
  keywords: ["base64", "encode", "decode", "btoa", "atob", "base64url"],
  icon: Binary,
  Component: lazy(() => import("./Tool")),
}

import { SquareTerminal } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const curl: Tool = {
  id: "curl",
  name: "cURL Converter",
  short: "fetch · Python · Go",
  description: {
    id: "Ubah perintah cURL menjadi kode JavaScript fetch, Python requests, atau Go net/http.",
    en: "Convert cURL commands into JavaScript fetch, Python requests, or Go net/http code.",
  },
  category: "converter",
  keywords: ["curl", "fetch", "python", "requests", "go", "http", "request", "api", "convert"],
  sensitive: true,
  icon: SquareTerminal,
  Component: lazy(() => import("./Tool")),
}

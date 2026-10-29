import { Unlink } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const urlParser: Tool = {
  id: "url-parser",
  name: "URL Parser",
  short: "Parts · Query params",
  description: {
    id: "Pecah URL menjadi protocol, host, port, path, dan fragment, lalu edit query param-nya dalam bentuk tabel.",
    en: "Break a URL into protocol, host, port, path, and fragment, then edit its query params as a table.",
    ja: "URL をプロトコル、ホスト、ポート、パス、フラグメントに分解し、クエリパラメーターを表形式で編集できます。",
  },
  category: "encoder",
  keywords: ["url", "parse", "parser", "query", "params", "querystring", "host", "path", "uri"],
  icon: Unlink,
  Component: lazy(() => import("./Tool")),
}

import { MonitorSmartphone } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const userAgent: Tool = {
  id: "user-agent",
  name: "User-Agent Parser",
  short: "Browser · OS · Device",
  description: {
    id: "Baca string User-Agent menjadi browser, engine, sistem operasi, jenis perangkat, dan arsitektur CPU.",
    en: "Parse a User-Agent string into browser, engine, operating system, device type, and CPU architecture.",
  },
  category: "text",
  keywords: ["user agent", "useragent", "ua", "browser", "os", "device", "parser", "detect"],
  icon: MonitorSmartphone,
  Component: lazy(() => import("./Tool")),
}

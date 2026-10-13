import { Database } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const sqlFormatter: Tool = {
  id: "sql-formatter",
  name: "SQL Formatter",
  short: "9 dialek",
  description: "Rapikan query SQL untuk PostgreSQL, MySQL, SQLite, SQL Server, dan lainnya.",
  category: "formatter",
  keywords: ["sql", "query", "format", "beautify", "postgres", "mysql", "sqlite"],
  icon: Database,
  Component: lazy(() => import("./Tool")),
}

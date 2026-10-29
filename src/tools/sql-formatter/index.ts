import { Database } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const sqlFormatter: Tool = {
  id: "sql-formatter",
  name: "SQL Formatter",
  short: { id: "9 dialek", en: "9 dialects", ja: "9 種類の方言" },
  description: {
    id: "Rapikan query SQL untuk PostgreSQL, MySQL, SQLite, SQL Server, dan lainnya.",
    en: "Format SQL queries for PostgreSQL, MySQL, SQLite, SQL Server, and more.",
    ja: "PostgreSQL、MySQL、SQLite、SQL Server などの SQL クエリを整形します。",
  },
  category: "formatter",
  keywords: ["sql", "query", "format", "beautify", "postgres", "mysql", "sqlite"],
  icon: Database,
  Component: lazy(() => import("./Tool")),
}

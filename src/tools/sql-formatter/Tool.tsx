import { sql } from "@codemirror/lang-sql"
import { useCallback, useState } from "react"
import type { KeywordCase, SqlLanguage } from "sql-formatter"
import { Dropdown } from "@/components/glass/Dropdown"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { formatSql, type SqlOptions } from "./logic"

const language = sql()

const SAMPLE =
  "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = true group by u.id, u.name order by orders desc limit 10"

const DIALECTS = [
  { value: "sql", label: "Standard SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "tsql", label: "SQL Server" },
  { value: "plsql", label: "Oracle PL/SQL" },
  { value: "bigquery", label: "BigQuery" },
  { value: "snowflake", label: "Snowflake" },
] as const satisfies readonly { value: SqlLanguage; label: string }[]

const CASES = [
  { value: "upper", label: "UPPER" },
  { value: "lower", label: "lower" },
  { value: "preserve", label: "Asli" },
] as const satisfies readonly { value: KeywordCase; label: string }[]

const INDENTS = [
  { value: 2, label: "2 spasi" },
  { value: 4, label: "4 spasi" },
] as const satisfies readonly { value: SqlOptions["indent"]; label: string }[]

export default function SqlFormatter() {
  const [dialect, setDialect] = useState<SqlLanguage>("sql")
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper")
  const [indent, setIndent] = useState<SqlOptions["indent"]>(2)

  const transform = useCallback(
    (input: string) => formatSql(input, { dialect, keywordCase, indent }),
    [dialect, keywordCase, indent],
  )

  return (
    <TransformTool
      transform={transform}
      inputLanguage={language}
      sample={SAMPLE}
      accept=".sql,text/plain"
      outputFileName="query.sql"
      options={
        <>
          <Dropdown<SqlLanguage> label="Dialek" value={dialect} options={DIALECTS} onChange={setDialect} />
          <Segmented<KeywordCase> label="Huruf keyword" value={keywordCase} options={CASES} onChange={setKeywordCase} />
          <Segmented<SqlOptions["indent"]> label="Indentasi" value={indent} options={INDENTS} onChange={setIndent} />
        </>
      }
    />
  )
}

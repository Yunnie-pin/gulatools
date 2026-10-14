import { sql } from "@codemirror/lang-sql"
import { useCallback } from "react"
import type { KeywordCase, SqlLanguage } from "sql-formatter"
import { Dropdown } from "@/components/glass/Dropdown"
import { Segmented } from "@/components/glass/Segmented"
import { TransformTool } from "@/components/TransformTool"
import { useMessages } from "@/i18n/locale"
import { labeled } from "@/lib/options"
import { isOption, oneOf, usePersistentState } from "@/lib/persist"
import { formatSql, type SqlOptions } from "./logic"
import { messages } from "./messages"

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

const CASES = ["upper", "lower", "preserve"] as const satisfies readonly KeywordCase[]

const INDENTS = [2, 4] as const satisfies readonly SqlOptions["indent"][]

export default function SqlFormatter() {
  const t = useMessages(messages)
  const [dialect, setDialect] = usePersistentState<SqlLanguage>("dialect", "sql", isOption(DIALECTS))
  const [keywordCase, setKeywordCase] = usePersistentState<KeywordCase>("keywordCase", "upper", oneOf(CASES))
  const [indent, setIndent] = usePersistentState<SqlOptions["indent"]>("indent", 2, oneOf(INDENTS))

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
          <Dropdown<SqlLanguage> label={t.dialect} value={dialect} options={DIALECTS} onChange={setDialect} />
          <Segmented<KeywordCase>
            label={t.keywordCase}
            value={keywordCase}
            options={labeled(CASES, t.cases)}
            onChange={setKeywordCase}
          />
          <Segmented<SqlOptions["indent"]>
            label={t.indent}
            value={indent}
            options={INDENTS.map((value) => ({ value, label: t.spaces(value) }))}
            onChange={setIndent}
          />
        </>
      }
    />
  )
}

import type { KeywordCase, SqlLanguage } from "sql-formatter"

export type SqlOptions = {
  dialect: SqlLanguage
  keywordCase: KeywordCase
  indent: 2 | 4
}

export async function formatSql(input: string, { dialect, keywordCase, indent }: SqlOptions): Promise<string> {
  const { format } = await import("sql-formatter")
  return format(input, { language: dialect, keywordCase, tabWidth: indent })
}

import { format, type KeywordCase, type SqlLanguage } from "sql-formatter"

export type SqlOptions = {
  dialect: SqlLanguage
  keywordCase: KeywordCase
  indent: 2 | 4
}

export function formatSql(input: string, { dialect, keywordCase, indent }: SqlOptions): string {
  return format(input, { language: dialect, keywordCase, tabWidth: indent })
}

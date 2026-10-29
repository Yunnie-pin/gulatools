import { defineMessages } from "@/i18n/locale"
import type { RegexFlag } from "./logic"

export const messages = defineMessages(
  {
    pattern: "Pola regex",
    flags: {
      g: "global",
      i: "abaikan huruf besar",
      m: "multiline",
      s: "dotAll",
      u: "unicode",
    } satisfies Record<RegexFlag, string>,
    replacement: "Pengganti",
    replacementPlaceholder: "Contoh: $<user> di $2",
    testText: "Teks uji",
    result: "Hasil",
    matches: (count: number, truncated: boolean) => `${count}${truncated ? "+" : ""} cocok`,
    replaced: "Hasil replace",
    empty: "(kosong)",
  },
  {
    pattern: "Regex pattern",
    flags: { g: "global", i: "ignore case", m: "multiline", s: "dotAll", u: "unicode" },
    replacement: "Replacement",
    replacementPlaceholder: "Example: $<user> at $2",
    testText: "Test text",
    result: "Result",
    matches: (count: number, truncated: boolean) =>
      `${count}${truncated ? "+" : ""} ${count === 1 && !truncated ? "match" : "matches"}`,
    replaced: "Replace result",
    empty: "(empty)",
  },
  {
    pattern: "正規表現パターン",
    flags: { g: "global", i: "大文字小文字を無視", m: "複数行", s: "dotAll", u: "unicode" },
    replacement: "置換文字列",
    replacementPlaceholder: "例: $<user> at $2",
    testText: "テスト用テキスト",
    result: "結果",
    matches: (count, truncated) => `${count}${truncated ? "+" : ""} 件のマッチ`,
    replaced: "置換結果",
    empty: "（空）",
  },
)

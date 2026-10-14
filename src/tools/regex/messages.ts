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
)

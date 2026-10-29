import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    dot: "Cocokkan dotfile (.env)",
    nocase: "Abaikan huruf besar/kecil",
    patterns: "Pola glob",
    patternsHint: "Satu pola per baris. Awali dengan ! untuk mengecualikan.",
    paths: "Path (satu per baris)",
    matched: "Cocok",
    unmatched: "Tidak cocok",
    regex: "Regex hasil kompilasi",
  },
  {
    dot: "Match dotfiles (.env)",
    nocase: "Ignore case",
    patterns: "Glob patterns",
    patternsHint: "One pattern per line. Prefix with ! to exclude.",
    paths: "Paths (one per line)",
    matched: "Matched",
    unmatched: "Not matched",
    regex: "Compiled regex",
  },
  {
    dot: "ドットファイル（.env）も対象にする",
    nocase: "大文字と小文字を区別しない",
    patterns: "glob パターン",
    patternsHint: "1 行に 1 パターン。先頭に ! を付けると除外します。",
    paths: "パス（1 行に 1 つ）",
    matched: "一致",
    unmatched: "不一致",
    regex: "コンパイル後の正規表現",
  },
)

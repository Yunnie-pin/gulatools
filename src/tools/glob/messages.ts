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
)

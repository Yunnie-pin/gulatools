import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    dialect: "Dialek",
    keywordCase: "Huruf keyword",
    cases: { upper: "UPPER", lower: "lower", preserve: "Asli" },
    indent: "Indentasi",
    spaces: (n: number) => `${n} spasi`,
  },
  {
    dialect: "Dialect",
    keywordCase: "Keyword case",
    cases: { upper: "UPPER", lower: "lower", preserve: "Original" },
    indent: "Indentation",
    spaces: (n: number) => `${n} spaces`,
  },
  {
    dialect: "方言",
    keywordCase: "キーワードの大文字・小文字",
    cases: { upper: "大文字", lower: "小文字", preserve: "元のまま" },
    indent: "インデント",
    spaces: (n) => `スペース ${n} 個`,
  },
)

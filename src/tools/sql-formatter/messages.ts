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
)

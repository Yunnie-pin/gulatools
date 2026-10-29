import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    language: "Bahasa",
    indent: "Indentasi",
    spaces: (n: number) => `${n} spasi`,
    printWidth: "Lebar baris",
    columns: (n: number) => `${n} kol`,
    semi: "Titik koma",
    singleQuote: "Kutip tunggal",
  },
  {
    language: "Language",
    indent: "Indentation",
    spaces: (n: number) => `${n} spaces`,
    printWidth: "Line width",
    columns: (n: number) => `${n} cols`,
    semi: "Semicolons",
    singleQuote: "Single quotes",
  },
  {
    language: "言語",
    indent: "インデント",
    spaces: (n) => `スペース ${n} 個`,
    printWidth: "行の幅",
    columns: (n) => `${n} 文字`,
    semi: "セミコロン",
    singleQuote: "シングルクォート",
  },
)

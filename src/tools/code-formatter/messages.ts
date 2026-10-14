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
)

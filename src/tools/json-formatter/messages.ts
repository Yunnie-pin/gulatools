import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  { indent: "Indentasi", spaces: (n: number) => `${n} spasi` },
  { indent: "Indentation", spaces: (n: number) => `${n} spaces` },
  { indent: "インデント", spaces: (n) => `スペース ${n} 個` },
)

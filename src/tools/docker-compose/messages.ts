import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  { ignored: (flags: string) => `Tidak dikonversi, tambahkan manual: ${flags}` },
  { ignored: (flags) => `Not converted, add these manually: ${flags}` },
)

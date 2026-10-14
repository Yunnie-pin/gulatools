import { defineMessages } from "@/i18n/locale"
import type { EscapeMode } from "./logic"

export const messages = defineMessages(
  {
    modes: {
      json: "JSON",
      jsonUnescape: "Unescape JSON",
      regex: "Regex",
      shell: "Shell",
      sql: "SQL",
    } satisfies Record<EscapeMode, string>,
  },
  {
    modes: { json: "JSON", jsonUnescape: "Unescape JSON", regex: "Regex", shell: "Shell", sql: "SQL" },
  },
)

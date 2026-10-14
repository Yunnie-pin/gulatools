import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    schema: "Schema",
    data: "Data",
    schemaPlaceholder: "Tempel JSON Schema…",
    dataPlaceholder: "Tempel JSON yang ingin divalidasi…",
    valid: "Valid",
    invalid: (count: number) => `${count} error`,
    draft: (draft: string) => `JSON Schema ${draft}`,
    issues: "Daftar error",
  },
  {
    schema: "Schema",
    data: "Data",
    schemaPlaceholder: "Paste a JSON Schema…",
    dataPlaceholder: "Paste the JSON to validate…",
    valid: "Valid",
    invalid: (count: number) => `${count} ${count === 1 ? "error" : "errors"}`,
    draft: (draft: string) => `JSON Schema ${draft}`,
    issues: "Errors",
  },
)

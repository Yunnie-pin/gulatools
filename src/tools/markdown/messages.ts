import { defineMessages } from "@/i18n/locale"

export type View = "preview" | "html"

export const messages = defineMessages(
  {
    view: "Tampilan",
    views: { preview: "Pratinjau", html: "HTML" } satisfies Record<View, string>,
    placeholder: "Tulis atau tempel Markdown…",
  },
  {
    view: "View",
    views: { preview: "Preview", html: "HTML" },
    placeholder: "Write or paste Markdown…",
  },
  {
    view: "表示",
    views: { preview: "プレビュー", html: "HTML" },
    placeholder: "Markdown を入力または貼り付け…",
  },
)

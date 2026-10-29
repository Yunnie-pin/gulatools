import { defineMessages } from "@/i18n/locale"

export type View = "preview" | "html"

export const messages = defineMessages(
  {
    sample:
      '# GulaTools\n\nDeveloper tools yang **manis** dan berjalan _sepenuhnya_ di browser.\n\n## Fitur\n\n- [x] Rapikan JSON dan SQL\n- [x] Decode JWT\n- [ ] Kopi gratis\n\n| Tool | Kategori |\n| ---- | -------- |\n| Base64 | Encoder |\n| UUID | Generator |\n\n> Data kamu tidak pernah meninggalkan perangkat ini.\n\n```ts\nconst gula = "manis"\n```\n\nLihat kode sumbernya di [GitHub](https://github.com).\n',
    view: "Tampilan",
    views: { preview: "Pratinjau", html: "HTML" } satisfies Record<View, string>,
    placeholder: "Tulis atau tempel Markdown…",
  },
  {
    sample:
      '# GulaTools\n\n**Sweet** developer tools that run _entirely_ in your browser.\n\n## Features\n\n- [x] Format JSON and SQL\n- [x] Decode JWT\n- [ ] Free coffee\n\n| Tool | Category |\n| ---- | -------- |\n| Base64 | Encoder |\n| UUID | Generator |\n\n> Your data never leaves this device.\n\n```ts\nconst sugar = "sweet"\n```\n\nVisit [GitHub](https://github.com) for the source.\n',
    view: "View",
    views: { preview: "Preview", html: "HTML" },
    placeholder: "Write or paste Markdown…",
  },
  {
    sample:
      '# GulaTools\n\nブラウザだけで _完結する_、**甘い** 開発者ツール集。\n\n## 機能\n\n- [x] JSON と SQL の整形\n- [x] JWT のデコード\n- [ ] 無料のコーヒー\n\n| ツール | カテゴリー |\n| ---- | -------- |\n| Base64 | Encoder |\n| UUID | Generator |\n\n> データがこの端末の外に出ることはありません。\n\n```ts\nconst sugar = "amai"\n```\n\nソースコードは [GitHub](https://github.com) で公開しています。\n',
    view: "表示",
    views: { preview: "プレビュー", html: "HTML" },
    placeholder: "Markdown を入力または貼り付け…",
  },
)

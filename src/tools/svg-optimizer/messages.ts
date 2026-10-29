import { defineMessages } from "@/i18n/locale"

export type View = "code" | "preview"

export const messages = defineMessages(
  {
    placeholder: "Tempel SVG atau buka file .svg…",
    precision: "Presisi angka",
    multipass: "Multipass",
    pretty: "Rapikan output",
    view: "Tampilan",
    views: { code: "Kode", preview: "Pratinjau" } satisfies Record<View, string>,
    size: (before: string, after: string, percent: number) => `${before} → ${after} (${percent}% lebih kecil)`,
    download: "Unduh SVG",
    preview: "Pratinjau SVG",
  },
  {
    placeholder: "Paste an SVG or open a .svg file…",
    precision: "Number precision",
    multipass: "Multipass",
    pretty: "Pretty output",
    view: "View",
    views: { code: "Code", preview: "Preview" },
    size: (before: string, after: string, percent: number) => `${before} → ${after} (${percent}% smaller)`,
    download: "Download SVG",
    preview: "SVG preview",
  },
  {
    placeholder: "SVG を貼り付けるか、.svg ファイルを開く…",
    precision: "数値の精度",
    multipass: "マルチパス",
    pretty: "整形して出力",
    view: "表示",
    views: { code: "コード", preview: "プレビュー" },
    size: (before, after, percent) => `${before} → ${after}（${percent}% 削減）`,
    download: "SVG をダウンロード",
    preview: "SVG のプレビュー",
  },
)

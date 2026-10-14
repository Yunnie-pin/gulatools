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
)

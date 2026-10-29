import { QrCode } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const qr: Tool = {
  id: "qr",
  name: "QR Code",
  short: { id: "Buat · Pindai", en: "Create · Scan", ja: "作成 · 読み取り" },
  description: {
    id: "Buat QR code dari teks atau URL (PNG/SVG), atau baca isi QR code dari gambar.",
    en: "Create QR codes from text or URLs (PNG/SVG), or read a QR code from an image.",
    ja: "テキストや URL から QR コード（PNG / SVG）を作成するか、画像から QR コードを読み取ります。",
  },
  category: "encoder",
  keywords: ["qr", "qrcode", "barcode", "scan", "pindai", "generate"],
  icon: QrCode,
  Component: lazy(() => import("./Tool")),
}

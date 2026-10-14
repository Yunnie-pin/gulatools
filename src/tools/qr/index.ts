import { QrCode } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const qr: Tool = {
  id: "qr",
  name: "QR Code",
  short: { id: "Buat · Pindai", en: "Create · Scan" },
  description: {
    id: "Buat QR code dari teks atau URL (PNG/SVG), atau baca isi QR code dari gambar.",
    en: "Create QR codes from text or URLs (PNG/SVG), or read a QR code from an image.",
  },
  category: "encoder",
  keywords: ["qr", "qrcode", "barcode", "scan", "pindai", "generate"],
  icon: QrCode,
  Component: lazy(() => import("./Tool")),
}

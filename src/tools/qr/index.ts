import { QrCode } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const qr: Tool = {
  id: "qr",
  name: "QR Code",
  short: "Buat · Pindai",
  description: "Buat QR code dari teks atau URL (PNG/SVG), atau baca isi QR code dari gambar.",
  category: "encoder",
  keywords: ["qr", "qrcode", "barcode", "scan", "pindai", "generate"],
  icon: QrCode,
  Component: lazy(() => import("./Tool")),
}

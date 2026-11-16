import { Wifi } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const wifiQr: Tool = {
  id: "wifi-qr",
  name: "Wi-Fi QR Code",
  short: { id: "Sambung tanpa ketik", en: "Join without typing", ja: "入力なしで接続" },
  description: {
    id: "Buat QR code Wi-Fi dari SSID dan password, supaya tamu bisa tersambung cukup dengan memindai kamera ponsel.",
    en: "Create a Wi-Fi QR code from an SSID and password, so guests can join by scanning it with a phone camera.",
    ja: "SSID とパスワードから Wi-Fi の QR コードを作成し、スマートフォンのカメラで読み取るだけで接続できるようにします。",
  },
  category: "generator",
  keywords: ["wifi", "wi-fi", "wlan", "qr", "qrcode", "ssid", "wpa", "hotspot", "network", "jaringan"],
  sensitive: true,
  icon: Wifi,
  Component: lazy(() => import("./Tool")),
}

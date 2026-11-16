import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    ssid: "Nama jaringan (SSID)",
    password: "Password",
    security: "Keamanan",
    securities: { WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "Tanpa password" },
    hidden: "Jaringan tersembunyi",
    qrFor: (ssid: string) => `QR code Wi-Fi untuk ${ssid}`,
    scanHint: "Arahkan kamera ponsel ke QR code untuk langsung tersambung.",
  },
  {
    ssid: "Network name (SSID)",
    password: "Password",
    security: "Security",
    securities: { WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "No password" },
    hidden: "Hidden network",
    qrFor: (ssid: string) => `Wi-Fi QR code for ${ssid}`,
    scanHint: "Point a phone camera at the code to join the network.",
  },
  {
    ssid: "ネットワーク名（SSID）",
    password: "パスワード",
    security: "セキュリティ",
    securities: { WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "パスワードなし" },
    hidden: "非公開ネットワーク",
    qrFor: (ssid) => `${ssid} の Wi-Fi QR コード`,
    scanHint: "スマートフォンのカメラでコードを読み取ると、そのまま接続できます。",
  },
)

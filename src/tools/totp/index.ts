import { Timer } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const totp: Tool = {
  id: "totp",
  name: "TOTP / 2FA",
  short: "Authenticator code",
  description: {
    id: "Buat kode 2FA (TOTP) dari secret Base32 atau URI otpauth://, lengkap dengan QR code untuk aplikasi authenticator.",
    en: "Generate 2FA (TOTP) codes from a Base32 secret or otpauth:// URI, with a QR code for authenticator apps.",
    ja: "Base32 のシークレットや otpauth:// URI から 2 段階認証（TOTP）のコードを生成し、認証アプリ用の QR コードも表示します。",
  },
  category: "crypto",
  keywords: ["totp", "2fa", "otp", "mfa", "authenticator", "google authenticator", "otpauth", "one-time password"],
  sensitive: true,
  icon: Timer,
  Component: lazy(() => import("./Tool")),
}

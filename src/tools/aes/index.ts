import { LockKeyhole } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const aes: Tool = {
  id: "aes",
  name: "AES Encrypt",
  short: "AES-256-GCM",
  description: {
    id: "Enkripsi dan dekripsi teks dengan AES-256-GCM. Kunci diturunkan dari password dengan PBKDF2.",
    en: "Encrypt and decrypt text with AES-256-GCM. The key is derived from a password with PBKDF2.",
    ja: "AES-256-GCM でテキストを暗号化・復号します。鍵はパスワードから PBKDF2 で導出します。",
  },
  category: "crypto",
  keywords: ["aes", "encrypt", "decrypt", "enkripsi", "dekripsi", "gcm", "pbkdf2", "cipher"],
  sensitive: true,
  icon: LockKeyhole,
  Component: lazy(() => import("./Tool")),
}

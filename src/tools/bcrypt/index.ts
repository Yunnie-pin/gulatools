import { Fingerprint } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const bcrypt: Tool = {
  id: "bcrypt",
  name: "Bcrypt",
  short: "Hash · Verify",
  description: {
    id: "Buat hash bcrypt dengan cost yang bisa diatur, lalu cocokkan password dengan hash.",
    en: "Create bcrypt hashes with an adjustable cost, then check passwords against a hash.",
    ja: "コストを調整して bcrypt ハッシュを作成し、パスワードがハッシュと一致するか確認します。",
  },
  category: "crypto",
  keywords: ["bcrypt", "password", "hash", "salt", "verify", "compare"],
  sensitive: true,
  icon: Fingerprint,
  Component: lazy(() => import("./Tool")),
}

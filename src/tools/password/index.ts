import { Asterisk } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const password: Tool = {
  id: "password",
  name: "Password Generator",
  short: { id: "Acak · Kuat", en: "Random · Strong", ja: "ランダム · 高強度" },
  description: {
    id: "Buat password acak yang kuat dengan crypto.getRandomValues, lengkap dengan estimasi entropi.",
    en: "Generate strong random passwords with crypto.getRandomValues, with an entropy estimate.",
    ja: "crypto.getRandomValues で強力なランダムパスワードを生成し、エントロピーの目安も表示します。",
  },
  category: "generator",
  keywords: ["password", "kata sandi", "generator", "random", "secure", "entropy"],
  sensitive: true,
  icon: Asterisk,
  Component: lazy(() => import("./Tool")),
}

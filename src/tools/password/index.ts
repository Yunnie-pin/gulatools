import { Asterisk } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const password: Tool = {
  id: "password",
  name: "Password Generator",
  short: "Acak · Kuat",
  description: "Buat password acak yang kuat dengan crypto.getRandomValues, lengkap dengan estimasi entropi.",
  category: "crypto",
  keywords: ["password", "kata sandi", "generator", "random", "secure", "entropy"],
  sensitive: true,
  icon: Asterisk,
  Component: lazy(() => import("./Tool")),
}

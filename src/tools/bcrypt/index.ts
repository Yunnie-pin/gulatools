import { Fingerprint } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const bcrypt: Tool = {
  id: "bcrypt",
  name: "Bcrypt",
  short: "Hash · Verify",
  description: "Buat hash bcrypt dengan cost yang bisa diatur, lalu cocokkan password dengan hash.",
  category: "crypto",
  keywords: ["bcrypt", "password", "hash", "salt", "verify", "compare"],
  sensitive: true,
  icon: Fingerprint,
  Component: lazy(() => import("./Tool")),
}

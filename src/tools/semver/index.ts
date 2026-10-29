import { Tag } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const semver: Tool = {
  id: "semver",
  name: "SemVer Checker",
  short: "Range · Satisfies",
  description: {
    id: "Cek versi mana yang memenuhi range semver seperti ^1.2.0 atau ~2.3, dengan aturan yang sama seperti npm.",
    en: "Check which versions satisfy a semver range such as ^1.2.0 or ~2.3, using the same rules as npm.",
    ja: "^1.2.0 や ~2.3 のような semver の範囲を満たすバージョンを、npm と同じルールで確認します。",
  },
  category: "text",
  keywords: ["semver", "version", "range", "npm", "caret", "tilde", "satisfies", "dependency", "versi"],
  icon: Tag,
  Component: lazy(() => import("./Tool")),
}

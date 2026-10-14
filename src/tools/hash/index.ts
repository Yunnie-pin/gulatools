import { Hash } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const hash: Tool = {
  id: "hash",
  name: "Hash Generator",
  short: "MD5 · SHA",
  description: {
    id: "Hitung MD5, SHA-1, SHA-256, SHA-384, dan SHA-512 dari teks atau file.",
    en: "Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 of text or files.",
  },
  category: "crypto",
  keywords: ["hash", "md5", "sha1", "sha256", "sha512", "checksum", "digest"],
  icon: Hash,
  Component: lazy(() => import("./Tool")),
}

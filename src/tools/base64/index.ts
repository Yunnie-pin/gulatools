import { Binary } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const base64: Tool = {
  id: "base64",
  name: "Base64",
  short: "Base64 · Base32 · Base58 · Hex",
  description: {
    id: "Encode dan decode Base64 (termasuk URL-safe), Base32, Base58, dan Hex. Aman untuk teks Unicode.",
    en: "Encode and decode Base64 (including URL-safe), Base32, Base58, and Hex. Safe for Unicode text.",
  },
  category: "encoder",
  keywords: ["base64", "encode", "decode", "btoa", "atob", "base64url", "base32", "base58", "hex", "bitcoin"],
  icon: Binary,
  Component: lazy(() => import("./Tool")),
}

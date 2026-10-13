import { KeySquare } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const argon2: Tool = {
  id: "argon2",
  name: "Argon2 & scrypt",
  short: "Password hashing",
  description: "Hash password dengan Argon2id, Argon2i, Argon2d, atau scrypt, lalu verifikasi hash Argon2.",
  category: "crypto",
  keywords: ["argon2", "argon2id", "scrypt", "kdf", "password", "hash", "verify"],
  sensitive: true,
  icon: KeySquare,
  Component: lazy(() => import("./Tool")),
}

import { KeyRound } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const keygen: Tool = {
  id: "keygen",
  name: "Key Generator",
  short: "RSA · EC · Ed25519",
  description: {
    id: "Buat pasangan kunci RSA, ECDSA, atau Ed25519 dalam format PEM dan JWK, siap dipakai untuk JWT.",
    en: "Generate RSA, ECDSA, or Ed25519 key pairs in PEM and JWK, ready for JWT.",
  },
  category: "crypto",
  keywords: ["rsa", "ecdsa", "ed25519", "keypair", "pem", "jwk", "public key", "private key", "generate"],
  sensitive: true,
  icon: KeyRound,
  Component: lazy(() => import("./Tool")),
}

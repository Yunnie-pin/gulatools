import { KeyRound } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const keygen: Tool = {
  id: "keygen",
  name: "Key Generator",
  short: "RSA · EC · Ed25519 · PEM ↔ JWK",
  description: {
    id: "Buat pasangan kunci RSA, ECDSA, atau Ed25519 dalam format PEM dan JWK, atau konversi kunci yang sudah ada antara PEM dan JWK.",
    en: "Generate RSA, ECDSA, or Ed25519 key pairs in PEM and JWK, or convert existing keys between PEM and JWK.",
  },
  category: "crypto",
  keywords: [
    "rsa",
    "ecdsa",
    "ed25519",
    "keypair",
    "pem",
    "jwk",
    "public key",
    "private key",
    "generate",
    "convert",
    "pem to jwk",
    "jwk to pem",
    "thumbprint",
  ],
  sensitive: true,
  icon: KeyRound,
  Component: lazy(() => import("./Tool")),
}

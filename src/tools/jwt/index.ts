import { KeyRound } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const jwt: Tool = {
  id: "jwt",
  name: "JWT",
  short: "Decode · Verify · Sign",
  description: {
    id: "Decode JWT, cek masa berlaku, verifikasi signature, atau buat token baru dengan HMAC, RSA, ECDSA, atau EdDSA.",
    en: "Decode JWTs, check expiry, verify signatures, or sign new tokens with HMAC, RSA, ECDSA, or EdDSA.",
  },
  category: "crypto",
  keywords: ["jwt", "token", "jose", "jws", "bearer", "decode", "verify", "signature", "sign", "encode"],
  sensitive: true,
  icon: KeyRound,
  Component: lazy(() => import("./Tool")),
}

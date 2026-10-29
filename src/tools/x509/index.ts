import { FileBadge } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const x509: Tool = {
  id: "x509",
  name: "X.509 Decoder",
  short: "PEM · DER · Chain",
  description: {
    id: "Baca isi sertifikat X.509 (PEM atau DER): subject, issuer, masa berlaku, SAN, key usage, dan fingerprint.",
    en: "Inspect X.509 certificates (PEM or DER): subject, issuer, validity, SAN, key usage, and fingerprints.",
    ja: "X.509 証明書（PEM または DER）の subject、issuer、有効期間、SAN、鍵用途、フィンガープリントを確認します。",
  },
  category: "crypto",
  keywords: ["x509", "certificate", "sertifikat", "pem", "der", "ssl", "tls", "crt", "san", "fingerprint"],
  icon: FileBadge,
  Component: lazy(() => import("./Tool")),
}

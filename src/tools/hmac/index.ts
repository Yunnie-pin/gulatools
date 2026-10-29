import { ShieldCheck } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const hmac: Tool = {
  id: "hmac",
  name: "HMAC Generator",
  short: "SHA-1 · SHA-2",
  description: {
    id: "Hitung HMAC dengan SHA-1, SHA-256, SHA-384, atau SHA-512 untuk memverifikasi webhook dan signature API.",
    en: "Compute HMAC with SHA-1, SHA-256, SHA-384, or SHA-512 to verify webhooks and API signatures.",
    ja: "SHA-1、SHA-256、SHA-384、SHA-512 で HMAC を計算し、Webhook や API の署名を検証します。",
  },
  category: "crypto",
  keywords: ["hmac", "signature", "webhook", "sha256", "mac", "sign"],
  sensitive: true,
  icon: ShieldCheck,
  Component: lazy(() => import("./Tool")),
}

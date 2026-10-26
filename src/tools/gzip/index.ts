import { FileArchive } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const gzip: Tool = {
  id: "gzip",
  name: "Gzip / Deflate",
  short: "Compress · Decompress",
  description: {
    id: "Kompres teks dengan gzip, zlib, atau raw deflate menjadi Base64, atau dekompres Base64 kembali ke teks dengan deteksi format otomatis.",
    en: "Compress text with gzip, zlib, or raw deflate into Base64, or decompress Base64 back to text with automatic format detection.",
  },
  category: "encoder",
  keywords: ["gzip", "deflate", "zlib", "compress", "decompress", "inflate", "base64", "kompres"],
  icon: FileArchive,
  Component: lazy(() => import("./Tool")),
}

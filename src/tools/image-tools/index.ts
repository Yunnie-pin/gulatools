import { ImageDown } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const imageTools: Tool = {
  id: "image-tools",
  name: "Image Compressor",
  short: "Resize · WebP · JPEG",
  description: {
    id: "Kompres, ubah ukuran, dan konversi gambar ke WebP, JPEG, atau PNG langsung di browser tanpa unggah.",
    en: "Compress, resize, and convert images to WebP, JPEG, or PNG right in your browser, with no upload.",
  },
  category: "converter",
  keywords: ["image", "gambar", "compress", "kompres", "resize", "webp", "jpeg", "png", "convert", "foto"],
  icon: ImageDown,
  Component: lazy(() => import("./Tool")),
}

import { Image } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const imageBase64: Tool = {
  id: "image-base64",
  name: "Image & Base64",
  short: "Data URI",
  description: {
    id: "Ubah gambar jadi data URI/Base64 (plus snippet CSS & HTML), atau tampilkan Base64 sebagai gambar.",
    en: "Turn images into data URIs/Base64 (plus CSS & HTML snippets), or preview Base64 as an image.",
  },
  category: "encoder",
  keywords: ["image", "gambar", "base64", "data uri", "datauri", "png", "jpg", "svg", "inline"],
  icon: Image,
  Component: lazy(() => import("./Tool")),
}

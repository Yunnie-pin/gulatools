import { Image } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const imageBase64: Tool = {
  id: "image-base64",
  name: "Image & Base64",
  short: "Data URI",
  description: "Ubah gambar jadi data URI/Base64 (plus snippet CSS & HTML), atau tampilkan Base64 sebagai gambar.",
  category: "encoder",
  keywords: ["image", "gambar", "base64", "data uri", "datauri", "png", "jpg", "svg", "inline"],
  icon: Image,
  Component: lazy(() => import("./Tool")),
}

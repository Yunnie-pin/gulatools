import { Link2 } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const slug: Tool = {
  id: "slug",
  name: "Slug Generator",
  short: "Title → url-slug",
  description: {
    id: "Ubah judul menjadi slug URL yang bersih, termasuk transliterasi huruf beraksen seperti é, ü, dan ß.",
    en: "Turn titles into clean URL slugs, including transliteration of accented letters such as é, ü, and ß.",
    ja: "タイトルをきれいな URL スラッグに変換します。é、ü、ß などのアクセント付き文字も変換します。",
  },
  category: "text",
  keywords: ["slug", "slugify", "url", "permalink", "seo", "kebab", "title", "judul"],
  icon: Link2,
  Component: lazy(() => import("./Tool")),
}

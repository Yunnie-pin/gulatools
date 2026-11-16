import { UserLock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const basicAuth: Tool = {
  id: "basic-auth",
  name: "Basic Auth Generator",
  short: "Authorization header",
  description: {
    id: "Buat header Authorization: Basic dari username dan password, lengkap dengan token Base64 dan contoh curl.",
    en: "Build an Authorization: Basic header from a username and password, with the Base64 token and a curl example.",
    ja: "ユーザー名とパスワードから Authorization: Basic ヘッダーを生成し、Base64 トークンと curl の例も表示します。",
  },
  category: "generator",
  keywords: ["basic auth", "authorization", "header", "http", "base64", "credentials", "htaccess", "curl"],
  sensitive: true,
  icon: UserLock,
  Component: lazy(() => import("./Tool")),
}

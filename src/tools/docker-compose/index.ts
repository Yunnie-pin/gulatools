import { Container } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const dockerCompose: Tool = {
  id: "docker-compose",
  name: "Docker run → Compose",
  short: "docker run → compose.yaml",
  description: {
    id: "Ubah satu atau beberapa perintah docker run menjadi file compose.yaml, termasuk port, volume, env, network, dan healthcheck.",
    en: "Turn one or more docker run commands into a compose.yaml file, including ports, volumes, env, networks, and healthchecks.",
    ja: "1 つ以上の docker run コマンドを compose.yaml に変換します。ポート、ボリューム、環境変数、ネットワーク、ヘルスチェックにも対応。",
  },
  category: "converter",
  keywords: ["docker", "compose", "docker-compose", "docker run", "yaml", "container", "composerize"],
  icon: Container,
  Component: lazy(() => import("./Tool")),
}

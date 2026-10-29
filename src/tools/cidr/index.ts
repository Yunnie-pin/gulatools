import { Network } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const cidr: Tool = {
  id: "cidr",
  name: "Subnet Calculator",
  short: "IPv4 · IPv6 · CIDR",
  description: {
    id: "Hitung network, broadcast, netmask, dan rentang host dari notasi CIDR IPv4 atau IPv6, termasuk jenis alamat dan reverse DNS.",
    en: "Work out the network, broadcast, netmask, and host range from IPv4 or IPv6 CIDR notation, including address type and reverse DNS.",
    ja: "IPv4 / IPv6 の CIDR 表記から、ネットワーク、ブロードキャスト、ネットマスク、ホスト範囲を計算します。アドレスの種類と逆引き DNS も表示。",
  },
  category: "converter",
  keywords: [
    "cidr",
    "subnet",
    "ip",
    "ipv4",
    "ipv6",
    "netmask",
    "network",
    "broadcast",
    "wildcard",
    "jaringan",
    "ip6.arpa",
  ],
  icon: Network,
  Component: lazy(() => import("./Tool")),
}

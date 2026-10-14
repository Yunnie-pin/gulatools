import { Network } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const cidr: Tool = {
  id: "cidr",
  name: "Subnet Calculator",
  short: "IPv4 · CIDR",
  description: {
    id: "Hitung network, broadcast, netmask, dan rentang host dari notasi CIDR atau netmask IPv4.",
    en: "Work out the network, broadcast, netmask, and host range from IPv4 CIDR notation or a netmask.",
  },
  category: "converter",
  keywords: ["cidr", "subnet", "ip", "ipv4", "netmask", "network", "broadcast", "wildcard", "jaringan"],
  icon: Network,
  Component: lazy(() => import("./Tool")),
}

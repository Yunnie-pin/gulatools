import { Clock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const timestamp: Tool = {
  id: "timestamp",
  name: "Timestamp",
  short: { id: "Unix · Tanggal · Zona waktu", en: "Unix · Date · Time zones" },
  description: {
    id: "Konversi Unix timestamp (detik sampai nanodetik) ke tanggal yang mudah dibaca dan sebaliknya, lihat waktunya di berbagai zona waktu, dan hitung selisih dua tanggal.",
    en: "Convert Unix timestamps (seconds to nanoseconds) into readable dates and back, see the time across time zones, and measure the gap between two dates.",
  },
  category: "converter",
  keywords: [
    "timestamp",
    "unix",
    "epoch",
    "date",
    "time",
    "iso",
    "tanggal",
    "waktu",
    "timezone",
    "zona waktu",
    "utc",
    "selisih",
  ],
  icon: Clock,
  Component: lazy(() => import("./Tool")),
}

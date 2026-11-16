import { Laptop } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const deviceInfo: Tool = {
  id: "device-info",
  name: "Device Information",
  short: "Screen · Hardware · Browser",
  description: {
    id: "Lihat info perangkat ini: resolusi layar, ukuran jendela, pixel ratio, CPU, RAM, GPU, browser, sistem operasi, bahasa, dan zona waktu.",
    en: "See this device's details: screen resolution, window size, pixel ratio, CPU, RAM, GPU, browser, operating system, languages, and time zone.",
    ja: "このデバイスの画面解像度、ウィンドウサイズ、ピクセル比、CPU、RAM、GPU、ブラウザ、OS、言語、タイムゾーンを表示します。",
  },
  category: "text",
  keywords: [
    "device",
    "info",
    "screen",
    "resolution",
    "viewport",
    "dpr",
    "gpu",
    "cpu",
    "browser",
    "perangkat",
    "layar",
  ],
  icon: Laptop,
  Component: lazy(() => import("./Tool")),
}

import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages<{
  useMine: string
  os: string
  device: string
  deviceType: string
  deviceTypes: Record<string, string>
  reducedHint: string
}>(
  {
    useMine: "Pakai User-Agent browser ini",
    os: "Sistem operasi",
    device: "Perangkat",
    deviceType: "Jenis perangkat",
    deviceTypes: {
      desktop: "Desktop",
      mobile: "Ponsel",
      tablet: "Tablet",
      smarttv: "Smart TV",
      wearable: "Wearable",
      console: "Konsol",
      embedded: "Embedded",
    },
    reducedHint:
      "Browser modern menyederhanakan User-Agent, misalnya Windows 11 tetap tertulis Windows 10 dan versi minor Chrome selalu 0.0.0.",
  },
  {
    useMine: "Use this browser's User-Agent",
    os: "Operating system",
    device: "Device",
    deviceType: "Device type",
    deviceTypes: {
      desktop: "Desktop",
      mobile: "Mobile",
      tablet: "Tablet",
      smarttv: "Smart TV",
      wearable: "Wearable",
      console: "Console",
      embedded: "Embedded",
    },
    reducedHint:
      "Modern browsers reduce the User-Agent, so Windows 11 still reports Windows 10 and Chrome's minor version is always 0.0.0.",
  },
  {
    useMine: "このブラウザの User-Agent を使う",
    os: "OS",
    device: "デバイス",
    deviceType: "デバイスの種類",
    deviceTypes: {
      desktop: "デスクトップ",
      mobile: "モバイル",
      tablet: "タブレット",
      smarttv: "スマートテレビ",
      wearable: "ウェアラブル",
      console: "ゲーム機",
      embedded: "組み込み機器",
    },
    reducedHint:
      "最近のブラウザは User-Agent を簡略化しているため、Windows 11 でも Windows 10 と表示され、Chrome のマイナーバージョンは常に 0.0.0 になります。",
  },
)

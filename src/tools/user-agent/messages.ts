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
)

import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    modes: { compress: "Kompres → Base64", decompress: "Base64 → Dekompres" },
    format: "Format",
    autoDetect: "Format (gzip, zlib, raw) dideteksi otomatis",
  },
  {
    modes: { compress: "Compress → Base64", decompress: "Base64 → Decompress" },
    format: "Format",
    autoDetect: "Format (gzip, zlib, raw) is detected automatically",
  },
)

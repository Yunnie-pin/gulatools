import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    modes: { create: "Buat", scan: "Pindai" },
    textOrUrl: "Teks atau URL",
    errorCorrection: "Koreksi error",
    levelHint: "Level lebih tinggi lebih tahan rusak, tapi kodenya lebih padat.",
    qrFor: (text: string) => `QR code untuk ${text}`,
    qrImage: "Gambar QR code",
    scannedImage: "Gambar yang dipindai",
    dropHint: "Seret gambar berisi QR code ke sini",
    reading: "Membaca…",
    pickImage: "Pilih gambar",
    contents: "Isi QR code",
    nothingScanned: "Belum ada gambar yang dipindai.",
  },
  {
    modes: { create: "Create", scan: "Scan" },
    textOrUrl: "Text or URL",
    errorCorrection: "Error correction",
    levelHint: "Higher levels survive more damage, but the code gets denser.",
    qrFor: (text: string) => `QR code for ${text}`,
    qrImage: "QR code image",
    scannedImage: "Scanned image",
    dropHint: "Drop an image with a QR code here",
    reading: "Reading…",
    pickImage: "Choose image",
    contents: "QR code contents",
    nothingScanned: "No image scanned yet.",
  },
)

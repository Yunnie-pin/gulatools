import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    tooLong: "Lebih dari 72 byte. Bcrypt hanya memakai 72 byte pertama.",
    createHash: "Buat hash",
    costHint: "Setiap +1 membuat hashing dua kali lebih lama. 10–12 umum dipakai.",
    hashing: "Menghitung…",
    generate: "Generate hash",
    doneIn: (seconds: number) => `Selesai dalam ${seconds.toFixed(2)} detik`,
    verify: "Verifikasi",
    hashInfo: (version: string, cost: number, salt: string) => `Versi $${version}$ · cost ${cost} · salt ${salt}`,
    checking: "Memeriksa…",
    check: "Cek kecocokan",
    match: "Password cocok",
    mismatch: "Password tidak cocok",
  },
  {
    tooLong: "Longer than 72 bytes. Bcrypt only uses the first 72 bytes.",
    createHash: "Create hash",
    costHint: "Each +1 doubles the hashing time. 10–12 is common.",
    hashing: "Hashing…",
    generate: "Generate hash",
    doneIn: (seconds: number) => `Done in ${seconds.toFixed(2)} s`,
    verify: "Verify",
    hashInfo: (version: string, cost: number, salt: string) => `Version $${version}$ · cost ${cost} · salt ${salt}`,
    checking: "Checking…",
    check: "Check match",
    match: "Password matches",
    mismatch: "Password does not match",
  },
)

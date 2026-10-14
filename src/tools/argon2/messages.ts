import { defineMessages } from "@/i18n/locale"
import type { Argon2Info } from "./logic"

export const messages = defineMessages(
  {
    createHash: "Buat hash",
    algorithm: "Algoritma",
    scryptHint: "r = 8, p = 1. Memori yang dipakai sekitar 128 × N × r byte.",
    memory: "Memori",
    memoryHint: "OWASP merekomendasikan minimal 19 MiB untuk Argon2id.",
    iterations: "Iterasi",
    parallelism: "Paralelisme",
    hashing: "Menghitung…",
    generate: "Generate hash",
    doneIn: (seconds: number) => `Selesai dalam ${seconds.toFixed(2)} detik`,
    verify: "Verifikasi Argon2",
    hashInfo: (info: Argon2Info) =>
      `${info.variant} · ${info.memoryMiB} MiB · ${info.iterations} iterasi · paralelisme ${info.parallelism}`,
    checking: "Memeriksa…",
    check: "Cek kecocokan",
    match: "Password cocok",
    mismatch: "Password tidak cocok",
  },
  {
    createHash: "Create hash",
    algorithm: "Algorithm",
    scryptHint: "r = 8, p = 1. Uses about 128 × N × r bytes of memory.",
    memory: "Memory",
    memoryHint: "OWASP recommends at least 19 MiB for Argon2id.",
    iterations: "Iterations",
    parallelism: "Parallelism",
    hashing: "Hashing…",
    generate: "Generate hash",
    doneIn: (seconds: number) => `Done in ${seconds.toFixed(2)} s`,
    verify: "Verify Argon2",
    hashInfo: (info: Argon2Info) =>
      `${info.variant} · ${info.memoryMiB} MiB · ${info.iterations} iterations · parallelism ${info.parallelism}`,
    checking: "Checking…",
    check: "Check match",
    match: "Password matches",
    mismatch: "Password does not match",
  },
)

import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    modes: { encrypt: "Enkripsi", decrypt: "Dekripsi" },
    text: "Teks",
    ciphertext: "Data terenkripsi (Base64)",
    keyHint: (iterations: string) => `Kunci AES-256 diturunkan dengan PBKDF2-SHA256, ${iterations} iterasi.`,
    processing: "Memproses…",
    results: { encrypt: "Hasil enkripsi", decrypt: "Hasil dekripsi" },
    formatHint: "Format hasil: Base64 dari salt (16 byte) + IV (12 byte) + ciphertext AES-GCM.",
  },
  {
    modes: { encrypt: "Encrypt", decrypt: "Decrypt" },
    text: "Text",
    ciphertext: "Encrypted data (Base64)",
    keyHint: (iterations: string) => `The AES-256 key is derived with PBKDF2-SHA256, ${iterations} iterations.`,
    processing: "Processing…",
    results: { encrypt: "Encrypted result", decrypt: "Decrypted result" },
    formatHint: "Output format: Base64 of salt (16 bytes) + IV (12 bytes) + AES-GCM ciphertext.",
  },
)

import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    secret: "Secret (Base32) atau URI otpauth://",
    secretHint: "Secret tidak disimpan dan tidak pernah meninggalkan browser ini.",
    generate: "Buat secret",
    issuer: "Issuer",
    account: "Akun",
    algorithm: "Algoritma",
    digits: "Digit",
    period: "Periode",
    empty: "Tempel secret atau buat yang baru untuk melihat kode.",
    currentCode: "Kode saat ini",
    remaining: (seconds: number) => `Berganti dalam ${seconds} detik`,
    next: "Berikutnya",
    qrLabel: "QR code untuk dipindai aplikasi authenticator",
  },
  {
    secret: "Secret (Base32) or otpauth:// URI",
    secretHint: "The secret is not stored and never leaves this browser.",
    generate: "New secret",
    issuer: "Issuer",
    account: "Account",
    algorithm: "Algorithm",
    digits: "Digits",
    period: "Period",
    empty: "Paste a secret or create a new one to see the code.",
    currentCode: "Current code",
    remaining: (seconds) => `Changes in ${seconds}s`,
    next: "Next",
    qrLabel: "QR code to scan with an authenticator app",
  },
)

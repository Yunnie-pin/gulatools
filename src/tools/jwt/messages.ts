import { defineMessages } from "@/i18n/locale"
import type { TimeClaim, TokenStatus } from "./logic"

export const messages = defineMessages(
  {
    tokenLabel: "Token JWT",
    tokenPlaceholder: "Tempel JWT di sini…",
    noAlg: "tanpa alg",
    status: { valid: "Masih berlaku", expired: "Kedaluwarsa", "not-yet-valid": "Belum berlaku" } satisfies Record<
      TokenStatus,
      string
    >,
    unsigned: "Tidak ditandatangani",
    verifySignature: "Verifikasi signature",
    publicKey: "Kunci publik (PEM atau JWK)",
    keyHint: "Kunci hanya dipakai di browser ini dan tidak disimpan.",
    signatureValid: "Signature valid",
    signatureInvalid: "Signature tidak valid",
    claims: { exp: "Kedaluwarsa", nbf: "Berlaku mulai", iat: "Diterbitkan" } satisfies Record<TimeClaim, string>,
    algorithm: "Algoritma",
    expiresIn: "Kedaluwarsa dalam",
    expiresInHint: "Kedaluwarsa dalam, misalnya 15m, 1h, 7d. Kosongkan untuk tanpa exp.",
    includeIat: "Sertakan iat",
    privateKey: "Private key (PKCS#8 PEM atau JWK)",
    emptyHint: "Isi secret atau private key untuk membuat token.",
  },
  {
    tokenLabel: "JWT token",
    tokenPlaceholder: "Paste a JWT here…",
    noAlg: "no alg",
    status: { valid: "Valid", expired: "Expired", "not-yet-valid": "Not yet valid" },
    unsigned: "Unsigned",
    verifySignature: "Verify signature",
    publicKey: "Public key (PEM or JWK)",
    keyHint: "The key is only used in this browser and is never stored.",
    signatureValid: "Signature valid",
    signatureInvalid: "Signature invalid",
    claims: { exp: "Expires", nbf: "Not before", iat: "Issued at" },
    algorithm: "Algorithm",
    expiresIn: "Expires in",
    expiresInHint: "Expires in, e.g. 15m, 1h, 7d. Leave empty for no exp.",
    includeIat: "Include iat",
    privateKey: "Private key (PKCS#8 PEM or JWK)",
    emptyHint: "Enter a secret or private key to sign a token.",
  },
)

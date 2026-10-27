import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    modes: { generate: "Generate", convert: "Konversi PEM ↔ JWK" },
    keyType: "Jenis kunci",
    generating: "Membuat…",
    generate: "Generate key pair",
    jwtAlg: (alg: string) => `Algoritma JWT: ${alg}`,
    keyInput: "Kunci PEM atau JWK",
    keyPlaceholder: '-----BEGIN PUBLIC KEY-----\n…\n-----END PUBLIC KEY-----\n\natau {"kty": "EC", …}',
    keyHint:
      "Mendukung PUBLIC KEY, PRIVATE KEY (PKCS#8), CERTIFICATE, dan JWK. Kunci hanya diproses di browser ini dan tidak disimpan.",
    algorithm: "Algoritma JWT",
    thumbprint: "JWK thumbprint (kid)",
  },
  {
    modes: { generate: "Generate", convert: "Convert PEM ↔ JWK" },
    keyType: "Key type",
    generating: "Generating…",
    generate: "Generate key pair",
    jwtAlg: (alg: string) => `JWT algorithm: ${alg}`,
    keyInput: "PEM or JWK key",
    keyPlaceholder: '-----BEGIN PUBLIC KEY-----\n…\n-----END PUBLIC KEY-----\n\nor {"kty": "EC", …}',
    keyHint:
      "Supports PUBLIC KEY, PRIVATE KEY (PKCS#8), CERTIFICATE, and JWK. Keys are processed only in this browser and never stored.",
    algorithm: "JWT algorithm",
    thumbprint: "JWK thumbprint (kid)",
  },
)

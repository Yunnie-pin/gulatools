import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    keyType: "Jenis kunci",
    generating: "Membuat…",
    generate: "Generate key pair",
    jwtAlg: (alg: string) => `Algoritma JWT: ${alg}`,
  },
  {
    keyType: "Key type",
    generating: "Generating…",
    generate: "Generate key pair",
    jwtAlg: (alg: string) => `JWT algorithm: ${alg}`,
  },
)

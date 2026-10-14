import { defineMessages } from "@/i18n/locale"
import type { CharsetId, StrengthLevel } from "./logic"

export const messages = defineMessages(
  {
    strength: { weak: "Lemah", fair: "Sedang", strong: "Kuat", veryStrong: "Sangat kuat" } satisfies Record<
      StrengthLevel,
      string
    >,
    entropy: (bits: number) => `≈ ${bits} bit entropi`,
    length: "Panjang",
    characters: (n: number) => `${n} karakter`,
    charsets: {
      lower: "Huruf kecil (a-z)",
      upper: "Huruf besar (A-Z)",
      digits: "Angka (0-9)",
      symbols: "Simbol (!@#…)",
    } satisfies Record<CharsetId, string>,
    excludeAmbiguous: "Hindari karakter mirip (O 0 l 1 I |)",
  },
  {
    strength: { weak: "Weak", fair: "Fair", strong: "Strong", veryStrong: "Very strong" },
    entropy: (bits: number) => `≈ ${bits} bits of entropy`,
    length: "Length",
    characters: (n: number) => `${n} characters`,
    charsets: {
      lower: "Lowercase (a-z)",
      upper: "Uppercase (A-Z)",
      digits: "Digits (0-9)",
      symbols: "Symbols (!@#…)",
    },
    excludeAmbiguous: "Avoid look-alike characters (O 0 l 1 I |)",
  },
)

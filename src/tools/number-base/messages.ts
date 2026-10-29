import { defineMessages } from "@/i18n/locale"
import type { Base } from "./logic"

export const messages = defineMessages(
  {
    input: "Bilangan",
    inputBase: "Basis input",
    placeholder: "255, 0xff, 0b1111_1111",
    bases: { 2: "Biner", 8: "Oktal", 10: "Desimal", 16: "Heksadesimal" } satisfies Record<Base, string>,
    twosComplement: (width: number) => `Two's complement ${width}-bit`,
  },
  {
    input: "Number",
    inputBase: "Input base",
    placeholder: "255, 0xff, 0b1111_1111",
    bases: { 2: "Binary", 8: "Octal", 10: "Decimal", 16: "Hexadecimal" },
    twosComplement: (width: number) => `${width}-bit two's complement`,
  },
  {
    input: "数値",
    inputBase: "入力の基数",
    placeholder: "255、0xff、0b1111_1111",
    bases: { 2: "2 進数", 8: "8 進数", 10: "10 進数", 16: "16 進数" },
    twosComplement: (width) => `${width} ビットの 2 の補数`,
  },
)

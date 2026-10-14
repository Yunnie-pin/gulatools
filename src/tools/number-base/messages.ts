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
)

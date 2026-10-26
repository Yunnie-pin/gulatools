import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    parts: "Komponen URL",
    params: (n: number) => `Query param (${n})`,
    add: "Tambah",
    noParams: "URL ini tidak punya query param.",
    keyN: (n: number) => `Key param ${n}`,
    valueN: (n: number) => `Nilai param ${n}`,
    removeN: (n: number) => `Hapus param ${n}`,
    result: "URL",
  },
  {
    parts: "URL parts",
    params: (n) => `Query params (${n})`,
    add: "Add",
    noParams: "This URL has no query params.",
    keyN: (n) => `Param ${n} key`,
    valueN: (n) => `Param ${n} value`,
    removeN: (n) => `Remove param ${n}`,
    result: "URL",
  },
)

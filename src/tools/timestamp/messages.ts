import { defineMessages } from "@/i18n/locale"
import type { TimestampUnit } from "./logic"

export const messages = defineMessages(
  {
    input: "Timestamp atau tanggal",
    placeholder: "1760000000 atau 2026-10-13T08:00:00Z",
    now: "Sekarang",
    readAs: (unit: string) => `Terbaca sebagai ${unit}`,
    units: {
      seconds: "detik",
      milliseconds: "milidetik",
      microseconds: "mikrodetik",
      nanoseconds: "nanodetik",
      date: "tanggal",
    } satisfies Record<TimestampUnit, string>,
    unixSeconds: "Unix (detik)",
    unixMillis: "Unix (milidetik)",
    local: (zone: string) => `Lokal (${zone})`,
    relative: "Relatif",
  },
  {
    input: "Timestamp or date",
    placeholder: "1760000000 or 2026-10-13T08:00:00Z",
    now: "Now",
    readAs: (unit: string) => `Read as ${unit}`,
    units: {
      seconds: "seconds",
      milliseconds: "milliseconds",
      microseconds: "microseconds",
      nanoseconds: "nanoseconds",
      date: "date",
    },
    unixSeconds: "Unix (seconds)",
    unixMillis: "Unix (milliseconds)",
    local: (zone: string) => `Local (${zone})`,
    relative: "Relative",
  },
)

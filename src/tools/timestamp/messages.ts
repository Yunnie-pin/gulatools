import { defineMessages } from "@/i18n/locale"
import type { Duration, TimestampUnit } from "./logic"

const parts = (duration: Duration, units: [day: string, hour: string, minute: string, second: string]) => {
  const values = [duration.days, duration.hours, duration.minutes, duration.seconds]
  const text = values
    .map((value, i) => (value ? `${value} ${units[i]}` : ""))
    .filter(Boolean)
    .join(" ")
  return text || `0 ${units[3]}`
}

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
    zones: "Zona waktu",
    addZone: "Tambah zona waktu",
    add: "Tambah",
    removeZone: (zone: string) => `Hapus ${zone}`,
    difference: "Selisih",
    compareWith: "Tanggal pembanding",
    duration: "Selisih",
    formatDuration: (duration: Duration) =>
      `${parts(duration, ["hari", "jam", "menit", "detik"])} ${duration.negative ? "sebelumnya" : "sesudahnya"}`,
    totalSeconds: "Total detik",
    totalDays: "Total hari",
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
    zones: "Time zones",
    addZone: "Add a time zone",
    add: "Add",
    removeZone: (zone: string) => `Remove ${zone}`,
    difference: "Difference",
    compareWith: "Date to compare with",
    duration: "Difference",
    formatDuration: (duration: Duration) =>
      `${parts(duration, ["d", "h", "m", "s"])} ${duration.negative ? "earlier" : "later"}`,
    totalSeconds: "Total seconds",
    totalDays: "Total days",
  },
  {
    input: "タイムスタンプまたは日付",
    placeholder: "1760000000 または 2026-10-13T08:00:00Z",
    now: "現在",
    readAs: (unit: string) => `${unit}として解釈`,
    units: {
      seconds: "秒",
      milliseconds: "ミリ秒",
      microseconds: "マイクロ秒",
      nanoseconds: "ナノ秒",
      date: "日付",
    },
    unixSeconds: "Unix（秒）",
    unixMillis: "Unix（ミリ秒）",
    local: (zone: string) => `ローカル（${zone}）`,
    relative: "相対時間",
    zones: "タイムゾーン",
    addZone: "タイムゾーンを追加",
    add: "追加",
    removeZone: (zone: string) => `${zone} を削除`,
    difference: "差",
    compareWith: "比較する日付",
    duration: "差",
    formatDuration: (duration: Duration) => {
      const units: [number, string][] = [
        [duration.days, "日"],
        [duration.hours, "時間"],
        [duration.minutes, "分"],
        [duration.seconds, "秒"],
      ]
      const text = units
        .filter(([value]) => value)
        .map(([value, unit]) => `${value}${unit}`)
        .join("")
      return `${text || "0秒"}${duration.negative ? "前" : "後"}`
    },
    totalSeconds: "合計秒数",
    totalDays: "合計日数",
  },
)

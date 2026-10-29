import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    order: "Urutan",
    orders: { keep: "Asli", asc: "A → Z", desc: "Z → A", reverse: "Balik", shuffle: "Acak" },
    unique: "Hapus duplikat",
    ignoreCase: "Abaikan huruf besar/kecil",
    trim: "Trim spasi",
    removeEmpty: "Buang baris kosong",
  },
  {
    order: "Order",
    orders: { keep: "Original", asc: "A → Z", desc: "Z → A", reverse: "Reverse", shuffle: "Shuffle" },
    unique: "Remove duplicates",
    ignoreCase: "Ignore case",
    trim: "Trim whitespace",
    removeEmpty: "Remove empty lines",
  },
  {
    order: "並び順",
    orders: { keep: "元の順", asc: "A → Z", desc: "Z → A", reverse: "逆順", shuffle: "シャッフル" },
    unique: "重複を削除",
    ignoreCase: "大文字と小文字を区別しない",
    trim: "前後の空白を除去",
    removeEmpty: "空行を削除",
  },
)

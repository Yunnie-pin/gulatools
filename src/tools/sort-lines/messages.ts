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
)

import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    unit: "Satuan",
    modes: { lines: "Baris", words: "Kata", chars: "Karakter" },
    ignoreWhitespace: "Abaikan spasi",
    original: "Asli",
    modified: "Diubah",
    difference: "Perbedaan",
  },
  {
    unit: "Granularity",
    modes: { lines: "Lines", words: "Words", chars: "Characters" },
    ignoreWhitespace: "Ignore whitespace",
    original: "Original",
    modified: "Modified",
    difference: "Difference",
  },
  {
    unit: "比較単位",
    modes: { lines: "行", words: "単語", chars: "文字" },
    ignoreWhitespace: "空白を無視",
    original: "変更前",
    modified: "変更後",
    difference: "差分",
  },
)

import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    original: "JSON asli",
    modified: "JSON diubah",
    difference: "Perbedaan",
    identical: "Kedua JSON identik. Urutan key dan format tidak dihitung sebagai perbedaan.",
    kinds: { added: "Ditambah", removed: "Dihapus", changed: "Diubah" },
  },
  {
    original: "Original JSON",
    modified: "Modified JSON",
    difference: "Difference",
    identical: "Both JSON documents are identical. Key order and formatting do not count as differences.",
    kinds: { added: "Added", removed: "Removed", changed: "Changed" },
  },
  {
    original: "変更前の JSON",
    modified: "変更後の JSON",
    difference: "差分",
    identical: "2 つの JSON は同一です。キーの順序や書式の違いは差分として扱いません。",
    kinds: { added: "追加", removed: "削除", changed: "変更" },
  },
)

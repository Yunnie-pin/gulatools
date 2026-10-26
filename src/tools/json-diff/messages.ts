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
)

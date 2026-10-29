import { defineMessages } from "@/i18n/locale"
import type { Action, PermissionClass } from "./logic"

export const messages = defineMessages(
  {
    input: "Mode",
    placeholder: "755, 4755 atau rwxr-xr-x",
    classes: { owner: "Pemilik", group: "Grup", others: "Lainnya" } satisfies Record<PermissionClass, string>,
    actions: { read: "Baca", write: "Tulis", execute: "Eksekusi" } satisfies Record<Action, string>,
    specials: "Bit khusus",
    octal: "Oktal",
    symbolic: "Simbolik",
    command: "Perintah",
  },
  {
    input: "Mode",
    placeholder: "755, 4755 or rwxr-xr-x",
    classes: { owner: "Owner", group: "Group", others: "Others" },
    actions: { read: "Read", write: "Write", execute: "Execute" },
    specials: "Special bits",
    octal: "Octal",
    symbolic: "Symbolic",
    command: "Command",
  },
  {
    input: "モード",
    placeholder: "755、4755、rwxr-xr-x など",
    classes: { owner: "所有者", group: "グループ", others: "その他" },
    actions: { read: "読み取り", write: "書き込み", execute: "実行" },
    specials: "特殊ビット",
    octal: "8 進数",
    symbolic: "記号表記",
    command: "コマンド",
  },
)

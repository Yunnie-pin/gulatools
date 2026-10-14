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
)

import { defineMessages } from "@/i18n/locale"
import type { EntityMode } from "./logic"

export const messages = defineMessages(
  {
    modes: { encode: "Encode", encodeAll: "Encode + non-ASCII", decode: "Decode" } satisfies Record<EntityMode, string>,
  },
  { modes: { encode: "Encode", encodeAll: "Encode + non-ASCII", decode: "Decode" } },
  { modes: { encode: "エンコード", encodeAll: "エンコード + 非 ASCII", decode: "デコード" } },
)

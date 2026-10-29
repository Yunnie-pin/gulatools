import { defineMessages } from "@/i18n/locale"
import type { EntityMode } from "./logic"

export const messages = defineMessages(
  {
    sample: '<p class="note">Gula & rempah — © 2026</p>',
    encodedSample: "&lt;p&gt;Gula &amp; rempah &mdash; &copy; 2026 &#x1F36C;&lt;/p&gt;",
    modes: { encode: "Encode", encodeAll: "Encode + non-ASCII", decode: "Decode" } satisfies Record<EntityMode, string>,
  },
  {
    sample: '<p class="note">Sugar & spice — © 2026</p>',
    encodedSample: "&lt;p&gt;Sugar &amp; spice &mdash; &copy; 2026 &#x1F36C;&lt;/p&gt;",
    modes: { encode: "Encode", encodeAll: "Encode + non-ASCII", decode: "Decode" },
  },
  {
    sample: '<p class="note">砂糖 & スパイス — © 2026</p>',
    encodedSample: "&lt;p&gt;&#x7802;&#x7CD6; &amp; スパイス &mdash; &copy; 2026 &#x1F36C;&lt;/p&gt;",
    modes: { encode: "エンコード", encodeAll: "エンコード + 非 ASCII", decode: "デコード" },
  },
)

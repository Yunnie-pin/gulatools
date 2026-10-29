import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  { sample: "q=gula manis&lang=id", modes: { component: "Encode komponen", uri: "Encode URL utuh", decode: "Decode" } },
  {
    sample: "q=sweet sugar&lang=en",
    modes: { component: "Encode component", uri: "Encode full URL", decode: "Decode" },
  },
  {
    sample: "q=甘い 砂糖&lang=ja",
    modes: { component: "コンポーネントをエンコード", uri: "URL 全体をエンコード", decode: "デコード" },
  },
)

import { FileCode2, type LucideIcon, Repeat2, ShieldLock, Sparkles, Type, WandSparkles } from "lucide-react"
import type { ComponentType, LazyExoticComponent } from "react"
import type { Localized, Text } from "@/i18n/locale"

export const CATEGORIES = {
  formatter: { name: "Formatter", icon: WandSparkles },
  converter: { name: "Converter", icon: Repeat2 },
  encoder: { name: "Encoder", icon: FileCode2 },
  crypto: { name: "Crypto", icon: ShieldLock },
  generator: { name: "Generator", icon: Sparkles },
  text: { name: "Text", icon: Type },
} as const satisfies Record<string, { name: string; icon: LucideIcon }>

export type CategoryId = keyof typeof CATEGORIES

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[]

export type Tool = {
  id: string
  name: string
  short: Text
  description: Localized
  category: CategoryId
  keywords: string[]
  sensitive?: boolean
  icon: LucideIcon
  Component: LazyExoticComponent<ComponentType>
}

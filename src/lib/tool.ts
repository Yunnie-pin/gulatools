import type { LucideIcon } from "lucide-react"
import type { ComponentType, LazyExoticComponent } from "react"

export const CATEGORIES = {
  formatter: { name: "Formatter" },
  converter: { name: "Converter" },
  encoder: { name: "Encoder" },
  crypto: { name: "Crypto" },
  generator: { name: "Generator" },
  text: { name: "Text" },
} as const satisfies Record<string, { name: string }>

export type CategoryId = keyof typeof CATEGORIES

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[]

export type Tool = {
  id: string
  name: string
  short: string
  description: string
  category: CategoryId
  keywords: string[]
  sensitive?: boolean
  icon: LucideIcon
  Component: LazyExoticComponent<ComponentType>
}

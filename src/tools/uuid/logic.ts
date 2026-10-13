import { ulid } from "ulid"
import { v4, v7 } from "uuid"

export const ID_KINDS = [
  { value: "uuid-v4", label: "UUID v4", generate: () => v4() },
  { value: "uuid-v7", label: "UUID v7", generate: () => v7() },
  { value: "ulid", label: "ULID", generate: () => ulid() },
] as const

export type IdKind = (typeof ID_KINDS)[number]["value"]

export const MAX_COUNT = 1000

export type IdOptions = {
  kind: IdKind
  count: number
  uppercase: boolean
}

export function generateIds({ kind, count, uppercase }: IdOptions): string[] {
  const { generate } = ID_KINDS.find((k) => k.value === kind) ?? ID_KINDS[0]
  const total = Math.min(MAX_COUNT, Math.max(1, Math.floor(count) || 1))
  return Array.from({ length: total }, () => {
    const id = generate()
    return uppercase ? id.toUpperCase() : id.toLowerCase()
  })
}

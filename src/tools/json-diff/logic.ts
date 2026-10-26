import { LocalizedError } from "@/i18n/errors"

export type JsonChange =
  | { kind: "added"; path: string; after: unknown }
  | { kind: "removed"; path: string; before: unknown }
  | { kind: "changed"; path: string; before: unknown; after: unknown }

type JsonObject = Record<string, unknown>

const isObject = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

const childPath = (path: string, key: string) =>
  IDENTIFIER.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`

export function diffJson(before: unknown, after: unknown, path = "$"): JsonChange[] {
  if (Array.isArray(before) && Array.isArray(after)) {
    return Array.from({ length: Math.max(before.length, after.length) }, (_, i) => {
      const itemPath = `${path}[${i}]`
      if (i >= after.length) return [{ kind: "removed", path: itemPath, before: before[i] } as const]
      if (i >= before.length) return [{ kind: "added", path: itemPath, after: after[i] } as const]
      return diffJson(before[i], after[i], itemPath)
    }).flat()
  }
  if (isObject(before) && isObject(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    return keys.flatMap((key): JsonChange[] => {
      const keyPath = childPath(path, key)
      if (!Object.hasOwn(after, key)) return [{ kind: "removed", path: keyPath, before: before[key] }]
      if (!Object.hasOwn(before, key)) return [{ kind: "added", path: keyPath, after: after[key] }]
      return diffJson(before[key], after[key], keyPath)
    })
  }
  return Object.is(before, after) ? [] : [{ kind: "changed", path, before, after }]
}

function parse(text: string, error: "invalidOriginalJson" | "invalidModifiedJson"): unknown {
  try {
    return JSON.parse(text)
  } catch (cause) {
    throw new LocalizedError(error, cause instanceof Error ? cause.message : String(cause))
  }
}

export const compareJson = (original: string, modified: string) =>
  diffJson(parse(original, "invalidOriginalJson"), parse(modified, "invalidModifiedJson"))

export const formatValue = (value: unknown) => JSON.stringify(value)

const SIGNS = { added: "+", removed: "-", changed: "~" } as const

export const toReport = (changes: JsonChange[]) =>
  changes
    .map((change) => {
      const value =
        change.kind === "changed"
          ? `${formatValue(change.before)} → ${formatValue(change.after)}`
          : formatValue(change.kind === "added" ? change.after : change.before)
      return `${SIGNS[change.kind]} ${change.path}: ${value}`
    })
    .join("\n")

import { JSONPath } from "jsonpath-plus"
import { LocalizedError } from "@/i18n/errors"

export function queryJson(input: string, path: string): string {
  const json: object | string | number | boolean | null = JSON.parse(input)
  if (!path.trim()) throw new LocalizedError("emptyJsonPath")
  if (!path.trim().startsWith("$")) throw new LocalizedError("jsonPathNeedsRoot")
  const result: unknown = JSONPath({ path: path.trim(), json, wrap: true, eval: "safe" })
  return JSON.stringify(result, null, 2)
}

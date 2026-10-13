import { JSONPath } from "jsonpath-plus"

export function queryJson(input: string, path: string): string {
  const json: object | string | number | boolean | null = JSON.parse(input)
  if (!path.trim()) throw new Error("Masukkan ekspresi JSONPath, misalnya $.store.book[*].title")
  if (!path.trim().startsWith("$")) throw new Error("Ekspresi JSONPath harus diawali dengan $")
  const result: unknown = JSONPath({ path: path.trim(), json, wrap: true, eval: "safe" })
  return JSON.stringify(result, null, 2)
}

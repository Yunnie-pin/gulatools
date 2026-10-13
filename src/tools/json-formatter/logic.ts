export type Indent = 2 | 4 | "\t"

export function formatJson(input: string, indent: Indent): string {
  return JSON.stringify(JSON.parse(input), null, indent)
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

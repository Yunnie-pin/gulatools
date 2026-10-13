type Primitive = "string" | "number" | "boolean" | "null" | "unknown"

type Field = { name: string; shape: Shape; optional: boolean }

export type Shape =
  | { kind: Primitive }
  | { kind: "array"; item: Shape }
  | { kind: "object"; fields: Field[] }
  | { kind: "union"; options: Shape[] }

export function infer(value: unknown): Shape {
  if (value === null) return { kind: "null" }
  if (Array.isArray(value)) {
    return { kind: "array", item: value.map(infer).reduce(merge, { kind: "unknown" }) }
  }
  if (typeof value === "string") return { kind: "string" }
  if (typeof value === "number") return { kind: "number" }
  if (typeof value === "boolean") return { kind: "boolean" }
  if (typeof value === "object") {
    return {
      kind: "object",
      fields: Object.entries(value).map(([name, v]) => ({ name, shape: infer(v), optional: false })),
    }
  }
  return { kind: "unknown" }
}

function mergeFields(a: Field[], b: Field[]): Field[] {
  const names = [...new Set([...a, ...b].map((f) => f.name))]
  return names.map((name) => {
    const left = a.find((f) => f.name === name)
    const right = b.find((f) => f.name === name)
    if (left && right) return { name, shape: merge(left.shape, right.shape), optional: left.optional || right.optional }
    const only = left ?? right
    return { name, shape: only?.shape ?? { kind: "unknown" }, optional: true }
  })
}

const optionsOf = (shape: Shape) => (shape.kind === "union" ? shape.options : [shape])

function merge(a: Shape, b: Shape): Shape {
  if (a.kind === "unknown") return b
  if (b.kind === "unknown") return a
  if (a.kind === "object" && b.kind === "object") return { kind: "object", fields: mergeFields(a.fields, b.fields) }
  if (a.kind === "array" && b.kind === "array") return { kind: "array", item: merge(a.item, b.item) }
  if (a.kind === b.kind && a.kind !== "union") return a

  const options: Shape[] = []
  for (const option of [...optionsOf(a), ...optionsOf(b)]) {
    const index = options.findIndex((existing) => existing.kind === option.kind)
    const existing = options[index]
    if (existing) options[index] = merge(existing, option)
    else options.push(option)
  }
  return options.length === 1 && options[0] ? options[0] : { kind: "union", options }
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

const property = (name: string) => (IDENTIFIER.test(name) ? name : JSON.stringify(name))

function pascal(text: string): string {
  const name = text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join("")
  return /^\d/.test(name) ? `T${name}` : name
}

function singular(name: string): string {
  if (name.endsWith("ies") && name.length > 4) return `${name.slice(0, -3)}y`
  if (name.endsWith("s") && !name.endsWith("ss") && name.length > 3) return name.slice(0, -1)
  return `${name}Item`
}

export function toTypeScript(value: unknown, rootName = "Root"): string {
  const declarations: string[] = []
  const used = new Set<string>()

  const reserve = (hint: string) => {
    const base = pascal(hint) || "Item"
    let name = base
    for (let i = 2; used.has(name); i++) name = `${base}${i}`
    used.add(name)
    return name
  }

  const declare = (name: string, fields: Field[]) => {
    const slot = declarations.push("") - 1
    const lines = fields.map((f) => `  ${property(f.name)}${f.optional ? "?" : ""}: ${typeOf(f.shape, f.name)}`)
    declarations[slot] = `export interface ${name} {\n${lines.join("\n")}\n}`
  }

  const typeOf = (shape: Shape, hint: string): string => {
    switch (shape.kind) {
      case "array": {
        const item = typeOf(shape.item, singular(hint))
        return shape.item.kind === "union" ? `(${item})[]` : `${item}[]`
      }
      case "object": {
        const name = reserve(hint)
        declare(name, shape.fields)
        return name
      }
      case "union":
        return shape.options.map((option) => typeOf(option, hint)).join(" | ")
      default:
        return shape.kind
    }
  }

  const shape = infer(value)
  if (shape.kind === "object") declare(reserve(rootName), shape.fields)
  else declarations.unshift(`export type ${reserve(rootName)} = ${typeOf(shape, rootName)}`)
  return `${declarations.join("\n\n")}\n`
}

export function toZod(value: unknown, rootName = "Root"): string {
  const schema = (shape: Shape, depth: number): string => {
    const pad = "  ".repeat(depth)
    switch (shape.kind) {
      case "array":
        return `z.array(${schema(shape.item, depth)})`
      case "object": {
        const lines = shape.fields.map(
          (f) => `${pad}  ${property(f.name)}: ${schema(f.shape, depth + 1)}${f.optional ? ".optional()" : ""},`,
        )
        return `z.object({\n${lines.join("\n")}\n${pad}})`
      }
      case "union": {
        const rest = shape.options.filter((option) => option.kind !== "null")
        const [only] = rest
        if (only && rest.length === 1) return `${schema(only, depth)}.nullable()`
        return `z.union([${shape.options.map((option) => schema(option, depth)).join(", ")}])`
      }
      default:
        return `z.${shape.kind}()`
    }
  }

  const typeName = pascal(rootName) || "Root"
  const schemaName = `${typeName[0]?.toLowerCase()}${typeName.slice(1)}Schema`
  return `import { z } from "zod"\n\nexport const ${schemaName} = ${schema(infer(value), 0)}\n\nexport type ${typeName} = z.infer<typeof ${schemaName}>\n`
}

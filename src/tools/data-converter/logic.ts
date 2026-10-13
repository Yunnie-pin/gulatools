import { XMLBuilder, XMLParser, XMLValidator } from "fast-xml-parser"
import Papa from "papaparse"
import { parse as parseToml, stringify as stringifyToml } from "smol-toml"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"
import { isRecord } from "@/lib/guards"

export const FORMATS = { json: "JSON", yaml: "YAML", toml: "TOML", xml: "XML", csv: "CSV" } as const

export type Format = keyof typeof FORMATS

const XML_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  format: true,
  indentBy: "  ",
}

function readXml(input: string): unknown {
  const validation = XMLValidator.validate(input)
  if (validation !== true) throw new Error(`XML tidak valid: ${validation.err.msg} (baris ${validation.err.line})`)
  return new XMLParser(XML_OPTIONS).parse(input)
}

function readCsv(input: string): unknown {
  const { data, errors } = Papa.parse(input.trim(), { header: true, dynamicTyping: true, skipEmptyLines: true })
  const [error] = errors
  if (error) throw new Error(`CSV tidak valid: ${error.message} (baris ${(error.row ?? 0) + 2})`)
  return data
}

function writeXml(value: unknown): string {
  if (isRecord(value) && Object.keys(value).length === 1) return new XMLBuilder(XML_OPTIONS).build(value)
  return new XMLBuilder(XML_OPTIONS).build({ root: Array.isArray(value) ? { item: value } : value })
}

function writeCsv(value: unknown): string {
  if (!Array.isArray(value) || !value.every(isRecord)) throw new Error("CSV membutuhkan array berisi objek")
  const rows = value.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, cell]) => [
        key,
        isRecord(cell) || Array.isArray(cell) ? JSON.stringify(cell) : cell,
      ]),
    ),
  )
  return Papa.unparse(rows)
}

function writeToml(value: unknown): string {
  if (!isRecord(value)) throw new Error("TOML membutuhkan objek di level teratas")
  return stringifyToml(value)
}

const readers: Record<Format, (input: string) => unknown> = {
  json: JSON.parse,
  yaml: parseYaml,
  toml: parseToml,
  xml: readXml,
  csv: readCsv,
}

const writers: Record<Format, (value: unknown) => string> = {
  json: (value) => JSON.stringify(value, null, 2),
  yaml: (value) => stringifyYaml(value),
  toml: writeToml,
  xml: writeXml,
  csv: writeCsv,
}

export const convert = (input: string, from: Format, to: Format) => writers[to](readers[from](input))

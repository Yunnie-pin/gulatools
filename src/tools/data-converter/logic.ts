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

const loadYaml = () => import("yaml")
const loadToml = () => import("smol-toml")
const loadXml = () => import("fast-xml-parser")
const loadCsv = async () => (await import("papaparse")).default

async function readXml(input: string): Promise<unknown> {
  const { XMLParser, XMLValidator } = await loadXml()
  const validation = XMLValidator.validate(input)
  if (validation !== true) throw new Error(`XML tidak valid: ${validation.err.msg} (baris ${validation.err.line})`)
  return new XMLParser(XML_OPTIONS).parse(input)
}

async function readCsv(input: string): Promise<unknown> {
  const Papa = await loadCsv()
  const { data, errors } = Papa.parse(input.trim(), { header: true, dynamicTyping: true, skipEmptyLines: true })
  const [error] = errors
  if (error) throw new Error(`CSV tidak valid: ${error.message} (baris ${(error.row ?? 0) + 2})`)
  return data
}

async function writeXml(value: unknown): Promise<string> {
  const { XMLBuilder } = await loadXml()
  if (isRecord(value) && Object.keys(value).length === 1) return new XMLBuilder(XML_OPTIONS).build(value)
  return new XMLBuilder(XML_OPTIONS).build({ root: Array.isArray(value) ? { item: value } : value })
}

async function writeCsv(value: unknown): Promise<string> {
  if (!Array.isArray(value) || !value.every(isRecord)) throw new Error("CSV membutuhkan array berisi objek")
  const Papa = await loadCsv()
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

async function writeToml(value: unknown): Promise<string> {
  if (!isRecord(value)) throw new Error("TOML membutuhkan objek di level teratas")
  return (await loadToml()).stringify(value)
}

const readers: Record<Format, (input: string) => Promise<unknown>> = {
  json: async (input) => JSON.parse(input),
  yaml: async (input) => (await loadYaml()).parse(input),
  toml: async (input) => (await loadToml()).parse(input),
  xml: readXml,
  csv: readCsv,
}

const writers: Record<Format, (value: unknown) => Promise<string>> = {
  json: async (value) => JSON.stringify(value, null, 2),
  yaml: async (value) => (await loadYaml()).stringify(value),
  toml: writeToml,
  xml: writeXml,
  csv: writeCsv,
}

export const convert = async (input: string, from: Format, to: Format) => writers[to](await readers[from](input))

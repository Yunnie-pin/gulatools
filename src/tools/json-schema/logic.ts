import Ajv, { type ErrorObject, type Options } from "ajv"
import Ajv2019 from "ajv/dist/2019"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"
import { LocalizedError } from "@/i18n/errors"
import { isRecord } from "@/lib/guards"

export type Draft = "draft-07" | "2019-09" | "2020-12"

export type SchemaIssue = { path: string; message: string }

export type ValidationResult = { draft: Draft; issues: SchemaIssue[] }

// I have nothing but my burger and I want nothing more
const OPTIONS: Options = { allErrors: true, strict: false }

export function detectDraft(schema: unknown): Draft {
  const uri = isRecord(schema) && typeof schema.$schema === "string" ? schema.$schema : ""
  if (uri.includes("2020-12")) return "2020-12"
  if (uri.includes("2019-09")) return "2019-09"
  return "draft-07"
}

function createAjv(draft: Draft) {
  const ajv = draft === "2020-12" ? new Ajv2020(OPTIONS) : draft === "2019-09" ? new Ajv2019(OPTIONS) : new Ajv(OPTIONS)
  addFormats(ajv)
  return ajv
}

function parseJson(text: string, key: "invalidSchemaJson" | "invalidDataJson"): unknown {
  try {
    return JSON.parse(text)
  } catch (error) {
    throw new LocalizedError(key, error instanceof Error ? error.message : String(error))
  }
}

const toIssue = ({ instancePath, message, keyword, params }: ErrorObject): SchemaIssue => ({
  path: instancePath || "/",
  message:
    keyword === "additionalProperties" ? `${message}: ${String(params.additionalProperty)}` : (message ?? keyword),
})

export function validateJson(schemaText: string, dataText: string): ValidationResult {
  const schema = parseJson(schemaText, "invalidSchemaJson")
  const data = parseJson(dataText, "invalidDataJson")
  const draft = detectDraft(schema)

  let validate: ReturnType<Ajv["compile"]>
  try {
    validate = createAjv(draft).compile(schema as object)
  } catch (error) {
    throw new LocalizedError("invalidSchema", error instanceof Error ? error.message : String(error))
  }

  return { draft, issues: validate(data) ? [] : (validate.errors ?? []).map(toIssue) }
}

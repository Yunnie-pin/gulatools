import { CATEGORY_IDS, type CategoryId, type Tool } from "@/lib/tool"
import { aes } from "./aes"
import { argon2 } from "./argon2"
import { base64 } from "./base64"
import { bcrypt } from "./bcrypt"
import { caseConverter } from "./case-converter"
import { codeFormatter } from "./code-formatter"
import { color } from "./color"
import { cron } from "./cron"
import { dataConverter } from "./data-converter"
import { diff } from "./diff"
import { hash } from "./hash"
import { hmac } from "./hmac"
import { imageBase64 } from "./image-base64"
import { jsonFormatter } from "./json-formatter"
import { jsonToTs } from "./json-to-ts"
import { jsonPath } from "./jsonpath"
import { jwt } from "./jwt"
import { keygen } from "./keygen"
import { password } from "./password"
import { qr } from "./qr"
import { regex } from "./regex"
import { sqlFormatter } from "./sql-formatter"
import { timestamp } from "./timestamp"
import { urlEncoder } from "./url-encoder"
import { uuid } from "./uuid"

export const tools: Tool[] = [
  jsonFormatter,
  codeFormatter,
  sqlFormatter,
  dataConverter,
  jsonToTs,
  jsonPath,
  timestamp,
  cron,
  color,
  base64,
  urlEncoder,
  imageBase64,
  qr,
  jwt,
  bcrypt,
  argon2,
  hash,
  hmac,
  aes,
  keygen,
  password,
  uuid,
  regex,
  diff,
  caseConverter,
]

export const toolsByCategory = Object.fromEntries(
  CATEGORY_IDS.map((id) => [id, tools.filter((tool) => tool.category === id)]),
) as Record<CategoryId, Tool[]>

const toolsById = new Map(tools.map((tool) => [tool.id, tool]))

export const findTool = (id: string) => toolsById.get(id)

export const resolveTools = (ids: readonly string[]) =>
  ids.flatMap((id) => {
    const tool = findTool(id)
    return tool ? [tool] : []
  })

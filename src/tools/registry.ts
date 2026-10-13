import { CATEGORY_IDS, type CategoryId, type Tool } from "@/lib/tool"
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
import { jsonFormatter } from "./json-formatter"
import { jwt } from "./jwt"
import { password } from "./password"
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
  timestamp,
  cron,
  color,
  base64,
  urlEncoder,
  jwt,
  bcrypt,
  hash,
  hmac,
  password,
  uuid,
  regex,
  diff,
  caseConverter,
]

export const toolsByCategory = Object.fromEntries(
  CATEGORY_IDS.map((id) => [id, tools.filter((tool) => tool.category === id)]),
) as Record<CategoryId, Tool[]>

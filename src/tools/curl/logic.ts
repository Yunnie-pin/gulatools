import { LocalizedError } from "@/i18n/errors"
import { bytesToBase64 } from "@/lib/bytes"

export type CurlTarget = "fetch" | "python" | "go"

export type CurlRequest = {
  method: string
  url: string
  headers: [name: string, value: string][]
  body?: string
}

const ANSI_C_ESCAPES: Record<string, string> = { n: "\n", t: "\t", r: "\r", "\\": "\\", "'": "'", '"': '"' }

export function tokenize(command: string): string[] {
  const text = command.replace(/\\\r?\n/g, " ")
  const tokens: string[] = []
  let current: string | null = null
  let i = 0

  const append = (chunk: string) => {
    current = (current ?? "") + chunk
  }

  while (i < text.length) {
    const char = text[i]!
    if (/\s/.test(char)) {
      if (current !== null) tokens.push(current)
      current = null
      i++
    } else if (char === "'") {
      const end = text.indexOf("'", i + 1)
      if (end < 0) throw new LocalizedError("curlUnclosedQuote")
      append(text.slice(i + 1, end))
      i = end + 1
    } else if (char === "$" && text[i + 1] === "'") {
      let chunk = ""
      i += 2
      while (i < text.length && text[i] !== "'") {
        if (text[i] === "\\" && i + 1 < text.length) {
          chunk += ANSI_C_ESCAPES[text[i + 1]!] ?? text[i + 1]
          i += 2
        } else chunk += text[i++]
      }
      if (i >= text.length) throw new LocalizedError("curlUnclosedQuote")
      append(chunk)
      i++
    } else if (char === '"') {
      let chunk = ""
      i++
      while (i < text.length && text[i] !== '"') {
        if (text[i] === "\\" && /["\\$`]/.test(text[i + 1] ?? "")) i++
        chunk += text[i++]
      }
      if (i >= text.length) throw new LocalizedError("curlUnclosedQuote")
      append(chunk)
      i++
    } else if (char === "\\" && i + 1 < text.length) {
      append(text[i + 1]!)
      i += 2
    } else {
      append(char)
      i++
    }
  }
  if (current !== null) tokens.push(current)
  return tokens
}

const VALUE_FLAGS: Record<string, string> = {
  "-X": "--request",
  "-H": "--header",
  "-d": "--data",
  "-u": "--user",
  "-A": "--user-agent",
  "-e": "--referer",
  "-b": "--cookie",
  "-F": "--form",
  "-o": "--output",
  "-m": "--max-time",
  "-w": "--write-out",
  "-x": "--proxy",
  "-c": "--cookie-jar",
  "-E": "--cert",
  "-T": "--upload-file",
}

const IGNORED_VALUE_FLAGS = new Set([
  "--output",
  "--max-time",
  "--connect-timeout",
  "--write-out",
  "--retry",
  "--proxy",
  "--cookie-jar",
  "--cert",
  "--key",
  "--cacert",
  "--resolve",
  "--limit-rate",
])

const DATA_FLAGS = new Set(["--data", "--data-raw", "--data-binary", "--data-ascii", "--data-urlencode", "--json"])

const UNSUPPORTED_FLAGS = new Set(["--form", "--form-string", "--upload-file"])

const takesValue = (flag: string) =>
  ["--request", "--header", "--user", "--user-agent", "--referer", "--cookie", "--url"].includes(flag) ||
  DATA_FLAGS.has(flag) ||
  UNSUPPORTED_FLAGS.has(flag) ||
  IGNORED_VALUE_FLAGS.has(flag)

function* options(tokens: string[]): Generator<[flag: string, value?: string]> {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token.startsWith("--")) {
      const eq = token.indexOf("=")
      const flag = eq > 0 ? token.slice(0, eq) : token
      if (!takesValue(flag)) yield [flag]
      else if (eq > 0) yield [flag, token.slice(eq + 1)]
      else {
        if (i + 1 >= tokens.length) throw new LocalizedError("curlMissingValue", flag)
        yield [flag, tokens[++i]]
      }
    } else if (token.startsWith("-") && token.length > 1) {
      for (let j = 1; j < token.length; j++) {
        const long = VALUE_FLAGS[`-${token[j]}`]
        if (!long) {
          yield [`-${token[j]}`]
          continue
        }
        const attached = token.slice(j + 1)
        if (attached) yield [long, attached]
        else if (i + 1 < tokens.length) yield [long, tokens[++i]]
        else throw new LocalizedError("curlMissingValue", `-${token[j]}`)
        break
      }
    } else yield ["", token]
  }
}

function encodeDataUrlencode(value: string) {
  const eq = value.indexOf("=")
  return eq < 0 ? encodeURIComponent(value) : `${value.slice(0, eq + 1)}${encodeURIComponent(value.slice(eq + 1))}`
}

export function parseCurl(command: string): CurlRequest {
  const tokens = tokenize(command.trim())
  if (tokens[0] !== "curl") throw new LocalizedError("curlNotCurl")

  let method: string | undefined
  let url: string | undefined
  let head = false
  let get = false
  const headers: [string, string][] = []
  const data: string[] = []

  for (const [flag, value = ""] of options(tokens.slice(1))) {
    if (flag === "" || flag === "--url") url ??= value
    else if (flag === "--request") method = value.toUpperCase()
    else if (flag === "--header") {
      const colon = value.indexOf(":")
      if (colon > 0) headers.push([value.slice(0, colon).trim(), value.slice(colon + 1).trim()])
    } else if (flag === "--json") {
      data.push(value)
      headers.push(["Content-Type", "application/json"], ["Accept", "application/json"])
    } else if (flag === "--data-urlencode") data.push(encodeDataUrlencode(value))
    else if (DATA_FLAGS.has(flag)) data.push(value)
    else if (flag === "--user")
      headers.push(["Authorization", `Basic ${bytesToBase64(new TextEncoder().encode(value))}`])
    else if (flag === "--user-agent") headers.push(["User-Agent", value])
    else if (flag === "--referer") headers.push(["Referer", value])
    else if (flag === "--cookie") headers.push(["Cookie", value])
    else if (flag === "--head" || flag === "-I") head = true
    else if (flag === "--get" || flag === "-G") get = true
    else if (UNSUPPORTED_FLAGS.has(flag)) throw new LocalizedError("curlUnsupportedFlag", flag)
  }

  if (!url) throw new LocalizedError("curlNoUrl")
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) url = `http://${url}`

  let body = data.length ? data.join("&") : undefined
  if (get && body) {
    url += `${url.includes("?") ? "&" : "?"}${body}`
    body = undefined
  }
  if (body && !headers.some(([name]) => name.toLowerCase() === "content-type")) {
    headers.push(["Content-Type", "application/x-www-form-urlencoded"])
  }

  return { method: method ?? (head ? "HEAD" : body ? "POST" : "GET"), url, headers, body }
}

const quote = (text: string) => JSON.stringify(text)

function toFetch({ method, url, headers, body }: CurlRequest) {
  const fields = [
    method !== "GET" && `  method: ${quote(method)},`,
    headers.length &&
      `  headers: {\n${headers.map(([name, value]) => `    ${quote(name)}: ${quote(value)},`).join("\n")}\n  },`,
    body !== undefined && `  body: ${quote(body)},`,
  ].filter(Boolean)
  const init = fields.length ? `, {\n${fields.join("\n")}\n}` : ""
  return `const response = await fetch(${quote(url)}${init})\nconst text = await response.text()\nconsole.log(text)\n`
}

const PYTHON_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])

function toPython({ method, url, headers, body }: CurlRequest) {
  const lines = ["import requests", ""]
  const args = [quote(url)]
  if (headers.length) {
    lines.push(
      `headers = {\n${headers.map(([name, value]) => `    ${quote(name)}: ${quote(value)},`).join("\n")}\n}`,
      "",
    )
    args.push("headers=headers")
  }
  if (body !== undefined) {
    lines.push(`data = ${quote(body)}`, "")
    args.push("data=data")
  }
  const call = PYTHON_METHODS.has(method)
    ? `requests.${method.toLowerCase()}(${args.join(", ")})`
    : `requests.request(${[quote(method), ...args].join(", ")})`
  lines.push(`response = ${call}`, "print(response.text)", "")
  return lines.join("\n")
}

function toGo({ method, url, headers, body }: CurlRequest) {
  const imports = ['"fmt"', '"io"', '"net/http"', ...(body !== undefined ? ['"strings"'] : [])]
  return [
    "package main",
    "",
    `import (\n${imports.map((name) => `\t${name}`).join("\n")}\n)`,
    "",
    "func main() {",
    ...(body !== undefined ? [`\tbody := strings.NewReader(${quote(body)})`] : []),
    `\treq, err := http.NewRequest(${quote(method)}, ${quote(url)}, ${body !== undefined ? "body" : "nil"})`,
    "\tif err != nil {\n\t\tpanic(err)\n\t}",
    ...headers.map(([name, value]) => `\treq.Header.Add(${quote(name)}, ${quote(value)})`),
    "",
    "\tresp, err := http.DefaultClient.Do(req)",
    "\tif err != nil {\n\t\tpanic(err)\n\t}",
    "\tdefer resp.Body.Close()",
    "",
    "\tout, err := io.ReadAll(resp.Body)",
    "\tif err != nil {\n\t\tpanic(err)\n\t}",
    "\tfmt.Println(string(out))",
    "}",
    "",
  ].join("\n")
}

const GENERATORS: Record<CurlTarget, (request: CurlRequest) => string> = { fetch: toFetch, python: toPython, go: toGo }

export const convertCurl = (command: string, target: CurlTarget) => GENERATORS[target](parseCurl(command))

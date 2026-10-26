import { LocalizedError } from "@/i18n/errors"

function decode(text: string) {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

export type QueryParam = [key: string, value: string]

export type ParsedUrl = {
  href: string
  parts: [label: string, value: string][]
  params: QueryParam[]
}

export function parseUrl(input: string): ParsedUrl {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    throw new LocalizedError("invalidUrl")
  }
  return {
    href: url.href,
    parts: [
      ["Protocol", url.protocol],
      ["Username", decode(url.username)],
      ["Password", decode(url.password)],
      ["Hostname", url.hostname],
      ["Port", url.port],
      ["Origin", url.origin === "null" ? "" : url.origin],
      ["Path", decode(url.pathname)],
      ["Query", url.search],
      ["Fragment", decode(url.hash)],
    ],
    params: [...url.searchParams],
  }
}

export function withParams(input: string, params: QueryParam[]): string {
  const url = new URL(input.trim())
  url.search = new URLSearchParams(params).toString()
  return url.href
}

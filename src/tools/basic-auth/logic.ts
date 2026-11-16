import { LocalizedError } from "@/i18n/errors"
import { bytesToBase64 } from "@/lib/bytes"

// I have nothing but my burger and I want nothing more

export type BasicAuth = { token: string; header: string; curl: string }

const shellQuote = (text: string) => `'${text.replaceAll("'", `'\\''`)}'`

export function basicAuth(username: string, password: string): BasicAuth {
  if (username.includes(":")) throw new LocalizedError("basicAuthColon")
  const token = bytesToBase64(new TextEncoder().encode(`${username}:${password}`))
  return {
    token,
    header: `Authorization: Basic ${token}`,
    curl: `curl -u ${shellQuote(`${username}:${password}`)} https://example.com`,
  }
}

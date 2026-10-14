import { LocalizedError } from "@/i18n/errors"
export const MIN_COST = 4
export const MAX_COST = 15
export const MAX_PASSWORD_BYTES = 72

export type BcryptInfo = {
  version: string
  cost: number
  salt: string
}

const BCRYPT_PATTERN = /^\$(2[abxy])\$(\d{2})\$([./A-Za-z0-9]{22})[./A-Za-z0-9]{31}$/

export function parseBcryptHash(hash: string): BcryptInfo {
  const match = BCRYPT_PATTERN.exec(hash.trim())
  if (!match) throw new LocalizedError("invalidBcrypt")
  const [, version = "", cost = "", salt = ""] = match
  return { version, cost: Number(cost), salt }
}

export const passwordBytes = (password: string) => new TextEncoder().encode(password).length

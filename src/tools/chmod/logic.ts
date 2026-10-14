import { LocalizedError } from "@/i18n/errors"

export const CLASSES = ["owner", "group", "others"] as const
export const ACTIONS = ["read", "write", "execute"] as const
export const SPECIALS = ["setuid", "setgid", "sticky"] as const

export type PermissionClass = (typeof CLASSES)[number]
export type Action = (typeof ACTIONS)[number]
export type Special = (typeof SPECIALS)[number]

const OCTAL = /^[0-7]{3,4}$/
const SYMBOLIC = /^[-dlbcps]?([r-][w-][xsS-])([r-][w-][xsS-])([r-][w-][xtT-])$/

export const bitOf = (permissionClass: PermissionClass, action: Action) =>
  (4 >> ACTIONS.indexOf(action)) << (3 * (2 - CLASSES.indexOf(permissionClass)))

const specialBitAt = (index: number) => 0o4000 >> index

export const specialBit = (special: Special) => specialBitAt(SPECIALS.indexOf(special))

export function parseMode(input: string): number {
  const text = input.trim()
  if (OCTAL.test(text)) return Number.parseInt(text, 8)

  const match = SYMBOLIC.exec(text)
  if (!match) throw new LocalizedError("invalidChmod")
  return CLASSES.reduce((mode, permissionClass, i) => {
    const [read, write, execute = "-"] = match[i + 1] ?? ""
    return (
      mode |
      (read === "r" ? bitOf(permissionClass, "read") : 0) |
      (write === "w" ? bitOf(permissionClass, "write") : 0) |
      ("xst".includes(execute) ? bitOf(permissionClass, "execute") : 0) |
      ("sStT".includes(execute) ? specialBitAt(i) : 0)
    )
  }, 0)
}

export const toOctal = (mode: number) => mode.toString(8).padStart(mode > 0o777 ? 4 : 3, "0")

export function toSymbolic(mode: number): string {
  return CLASSES.map((permissionClass, i) => {
    const special = (mode & specialBitAt(i)) !== 0
    const execute = (mode & bitOf(permissionClass, "execute")) !== 0
    const specialChar = i === 2 ? "t" : "s"
    return [
      mode & bitOf(permissionClass, "read") ? "r" : "-",
      mode & bitOf(permissionClass, "write") ? "w" : "-",
      special ? (execute ? specialChar : specialChar.toUpperCase()) : execute ? "x" : "-",
    ].join("")
  }).join("")
}

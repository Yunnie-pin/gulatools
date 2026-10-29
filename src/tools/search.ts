import Fuse from "fuse.js"
import { LOCALES } from "@/i18n/locale"
import type { Tool } from "@/lib/tool"
import { tools } from "./registry"

const fuse = new Fuse(tools, {
  keys: ["id", "name", "keywords", ...LOCALES.map((locale) => `description.${locale}`)],
  threshold: 0.4,
})

export const searchTools = (query: string): Tool[] => fuse.search(query).map((result) => result.item)

function decode(segment: string) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

export const queryFromPath = (pathname: string) =>
  decode(pathname.split("/").filter(Boolean).pop() ?? "")
    .replace(/\.html?$/, "")
    .replace(/[-_.]+/g, " ")
    .trim()

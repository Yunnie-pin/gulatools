import { useEffect } from "react"

export const SITE_NAME = "GulaTools"

export const SITE_DESCRIPTION =
  "Developer tools yang berjalan 100% di browser: formatter, converter, JWT, bcrypt, hash, dan lainnya. Data tidak pernah meninggalkan perangkat."

export const pageTitle = (title?: string) =>
  title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: developer tools di browser`

export function usePageMeta(title?: string, description = SITE_DESCRIPTION) {
  useEffect(() => {
    document.title = pageTitle(title)
    document.querySelector('meta[name="description"]')?.setAttribute("content", description)
  }, [title, description])
}

import DOMPurify from "dompurify"

// I have nothing but my burger and I want nothing more
const REMOTE_URL = /^\s*(https?:)?\/\//i

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  for (const name of ["src", "poster"]) {
    if (REMOTE_URL.test(node.getAttribute(name) ?? "")) node.removeAttribute(name)
  }
  node.removeAttribute("srcset")
  if (node.tagName !== "A") return
  node.setAttribute("target", "_blank")
  node.setAttribute("rel", "noopener noreferrer")
})

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html, { FORBID_ATTR: ["style"] })

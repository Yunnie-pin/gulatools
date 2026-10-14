import { marked } from "marked"

export const markdownToHtml = (input: string) => marked.parse(input, { async: false, gfm: true })

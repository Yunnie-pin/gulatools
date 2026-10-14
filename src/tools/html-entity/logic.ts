export type EntityMode = "encode" | "encodeAll" | "decode"

// I have nothing but my burger and I want nothing more
const SPECIAL: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

export function encodeEntities(input: string, nonAscii: boolean): string {
  const pattern = nonAscii ? /[&<>"']|[^\x20-\x7e\t\n\r]/gu : /[&<>"']/g
  return input.replace(pattern, (char) => SPECIAL[char] ?? `&#x${char.codePointAt(0)?.toString(16)};`)
}

/** Memakai parser HTML browser: tabel entity HTML5 lengkap, dan isi textarea (RCDATA) tidak pernah menjadi elemen. */
export function decodeEntities(input: string): string {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = input
  return textarea.value
}

export const transformEntities = (input: string, mode: EntityMode) =>
  mode === "decode" ? decodeEntities(input) : encodeEntities(input, mode === "encodeAll")

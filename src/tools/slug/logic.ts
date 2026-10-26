export type SlugSeparator = "-" | "_" | "."

const SPECIAL: Record<string, string> = {
  ß: "ss",
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
  ø: "o",
  Ø: "O",
  đ: "d",
  Đ: "D",
  ł: "l",
  Ł: "L",
  þ: "th",
  Þ: "TH",
}

export function slugify(text: string, separator: SlugSeparator, lowercase: boolean): string {
  const ascii = text
    .replace(/[ßæÆœŒøØđĐłŁþÞ]/g, (char) => SPECIAL[char] ?? char)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
  const slug = ascii
    .replace(/[^A-Za-z0-9]+/g, separator)
    .split(separator)
    .filter(Boolean)
    .join(separator)
  return lowercase ? slug.toLowerCase() : slug
}

export const slugifyLines = (input: string, separator: SlugSeparator, lowercase: boolean) =>
  input
    .split(/\r?\n/)
    .map((line) => slugify(line, separator, lowercase))
    .join("\n")

export const UNITS = ["paragraphs", "sentences", "words"] as const

export type LoremUnit = (typeof UNITS)[number]

export type LoremOptions = {
  unit: LoremUnit
  count: number
  classic: boolean
}

export const MAX_COUNT: Record<LoremUnit, number> = { paragraphs: 50, sentences: 200, words: 2000 }

// I have nothing but my burger and I want nothing more
const CLASSIC = "lorem ipsum dolor sit amet consectetur adipiscing elit".split(" ")

const WORDS = [
  ...CLASSIC,
  ..."sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  ),
]

const between = (random: () => number, min: number, max: number) => min + Math.floor(random() * (max - min + 1))

const pick = (random: () => number) => WORDS[Math.floor(random() * WORDS.length)] ?? "lorem"

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

function words(random: () => number, count: number, classic: boolean): string[] {
  const start = classic ? CLASSIC.slice(0, count) : []
  return [...start, ...Array.from({ length: count - start.length }, () => pick(random))]
}

function sentence(random: () => number, classic: boolean): string {
  const parts = words(random, classic ? CLASSIC.length : between(random, 6, 14), classic)
  const comma = classic ? 4 : parts.length > 8 ? between(random, 3, parts.length - 3) : -1
  return `${capitalize(parts.map((word, i) => (i === comma ? `${word},` : word)).join(" "))}.`
}

const sentences = (random: () => number, count: number, classic: boolean) =>
  Array.from({ length: count }, (_, i) => sentence(random, classic && i === 0))

export const clampCount = (unit: LoremUnit, count: number) =>
  Math.min(MAX_COUNT[unit], Math.max(1, Math.floor(count) || 1))

export function generateLorem({ unit, count, classic }: LoremOptions, random: () => number): string {
  const n = clampCount(unit, count)
  if (unit === "words") return capitalize(words(random, n, classic).join(" "))
  if (unit === "sentences") return sentences(random, n, classic).join(" ")
  return Array.from({ length: n }, (_, i) =>
    sentences(random, between(random, 4, 7), classic && i === 0).join(" "),
  ).join("\n\n")
}

export type LineOrder = "keep" | "asc" | "desc" | "reverse" | "shuffle"

export type LineOptions = {
  order: LineOrder
  unique: boolean
  ignoreCase: boolean
  trim: boolean
  removeEmpty: boolean
}

function shuffle(lines: string[], random: () => number) {
  const result = [...lines]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

export function processLines(input: string, options: LineOptions, random: () => number = Math.random): string {
  let lines = input.split(/\r?\n/)
  if (options.trim) lines = lines.map((line) => line.trim())
  if (options.removeEmpty) lines = lines.filter((line) => line.trim())

  if (options.unique) {
    const seen = new Set<string>()
    lines = lines.filter((line) => {
      const key = options.ignoreCase ? line.toLocaleLowerCase() : line
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: options.ignoreCase ? "base" : "variant" })
  if (options.order === "asc") lines.sort(collator.compare)
  else if (options.order === "desc") lines.sort((a, b) => collator.compare(b, a))
  else if (options.order === "reverse") lines.reverse()
  else if (options.order === "shuffle") lines = shuffle(lines, random)

  return lines.join("\n")
}

import picomatch from "picomatch/posix"

export type GlobOptions = { dot: boolean; nocase: boolean }

export type GlobPattern = { pattern: string; negated: boolean; regex: string }

export type GlobReport = {
  patterns: GlobPattern[]
  matched: string[]
  unmatched: string[]
}

const lines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

export function testGlobs(patternText: string, pathText: string, options: GlobOptions): GlobReport {
  const patterns = lines(patternText).map((line) => {
    const negated = line.startsWith("!")
    const pattern = negated ? line.slice(1) : line
    return { pattern, negated, regex: picomatch.makeRe(pattern, options).source }
  })
  const include = picomatch(
    patterns.filter((p) => !p.negated).map((p) => p.pattern),
    options,
  )
  const excluded = patterns.filter((p) => p.negated).map((p) => picomatch(p.pattern, options))

  const matched: string[] = []
  const unmatched: string[] = []
  for (const path of lines(pathText)) {
    const hit = include(path) && !excluded.some((isExcluded) => isExcluded(path))
    ;(hit ? matched : unmatched).push(path)
  }
  return { patterns, matched, unmatched }
}

import { type Change, createTwoFilesPatch, diffChars, diffLines, diffWords, diffWordsWithSpace } from "diff"

export type DiffMode = "lines" | "words" | "chars"

export type DiffSummary = { added: number; removed: number }

export function diffTexts(original: string, modified: string, mode: DiffMode, ignoreWhitespace: boolean): Change[] {
  if (mode === "lines") return diffLines(original, modified, { ignoreWhitespace })
  if (mode === "words") return ignoreWhitespace ? diffWords(original, modified) : diffWordsWithSpace(original, modified)
  return diffChars(original, modified)
}

export function summarize(changes: Change[]): DiffSummary {
  return changes.reduce(
    (summary, change) => ({
      added: summary.added + (change.added ? change.count : 0),
      removed: summary.removed + (change.removed ? change.count : 0),
    }),
    { added: 0, removed: 0 },
  )
}

export const toPatch = (original: string, modified: string) =>
  createTwoFilesPatch("original", "modified", original, modified)

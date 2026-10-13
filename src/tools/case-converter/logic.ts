import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from "change-case"

export const CASES = [
  { id: "camel", label: "camelCase", convert: camelCase },
  { id: "pascal", label: "PascalCase", convert: pascalCase },
  { id: "snake", label: "snake_case", convert: snakeCase },
  { id: "constant", label: "CONSTANT_CASE", convert: constantCase },
  { id: "kebab", label: "kebab-case", convert: kebabCase },
  { id: "train", label: "Train-Case", convert: trainCase },
  { id: "dot", label: "dot.case", convert: dotCase },
  { id: "path", label: "path/case", convert: pathCase },
  { id: "title", label: "Title Case", convert: capitalCase },
  { id: "sentence", label: "Sentence case", convert: sentenceCase },
  { id: "lower", label: "lowercase", convert: (text: string) => text.toLowerCase() },
  { id: "upper", label: "UPPERCASE", convert: (text: string) => text.toUpperCase() },
] as const

export type CaseId = (typeof CASES)[number]["id"]

export const convertCase = (text: string, id: CaseId) => {
  const { convert } = CASES.find((c) => c.id === id) ?? CASES[0]
  return text
    .split("\n")
    .map((line) => convert(line))
    .join("\n")
}

import type { Plugin } from "prettier"

const estree = () => import("prettier/plugins/estree")
const babel = () => import("prettier/plugins/babel")
const typescript = () => import("prettier/plugins/typescript")
const postcss = () => import("prettier/plugins/postcss")
const html = () => import("prettier/plugins/html")
const markdown = () => import("prettier/plugins/markdown")
const graphql = () => import("prettier/plugins/graphql")
const yaml = () => import("prettier/plugins/yaml")
const xml = async () => (await import("@prettier/plugin-xml")).default as Plugin

type PluginLoader = () => Promise<Plugin>

export const LANGUAGES = {
  javascript: { label: "JavaScript", parser: "babel", plugins: [babel, estree] },
  typescript: { label: "TypeScript", parser: "typescript", plugins: [typescript, estree] },
  css: { label: "CSS", parser: "css", plugins: [postcss] },
  scss: { label: "SCSS", parser: "scss", plugins: [postcss] },
  less: { label: "Less", parser: "less", plugins: [postcss] },
  html: { label: "HTML", parser: "html", plugins: [html, babel, estree, postcss] },
  markdown: { label: "Markdown", parser: "markdown", plugins: [markdown] },
  graphql: { label: "GraphQL", parser: "graphql", plugins: [graphql] },
  yaml: { label: "YAML", parser: "yaml", plugins: [yaml] },
  xml: { label: "XML", parser: "xml", plugins: [xml], options: { xmlWhitespaceSensitivity: "ignore" } },
} as const satisfies Record<
  string,
  { label: string; parser: string; plugins: PluginLoader[]; options?: Record<string, unknown> }
>

export type LanguageId = keyof typeof LANGUAGES

export type CodeOptions = {
  language: LanguageId
  tabWidth: 2 | 4
  printWidth: 80 | 100 | 120
  semi: boolean
  singleQuote: boolean
}

export async function formatCode(input: string, { language, ...options }: CodeOptions): Promise<string> {
  const spec = LANGUAGES[language]
  const { parser, plugins } = spec
  const [{ format }, loaded] = await Promise.all([
    import("prettier/standalone"),
    Promise.all(plugins.map((load) => load())),
  ])
  return format(input, { parser, plugins: loaded, ...options, ...("options" in spec ? spec.options : {}) })
}

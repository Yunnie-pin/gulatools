import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES, type Locale, localizePath } from "../src/i18n/locale"
import { ui } from "../src/i18n/ui"
import { pageTitle, SITE_NAME } from "../src/lib/meta"
import { CATEGORIES, type Tool } from "../src/lib/tool"
import { about } from "../src/tools/about"
import { tools, toolsByCategory } from "../src/tools/registry"

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist")
const SITE_URL = process.env.SITE_URL?.replace(/\/$/, "")

const OG_LOCALES: Record<Locale, string> = { id: "id_ID", en: "en_US", ja: "ja_JP" }

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

type Page = { route: string; locale: Locale; title: string; description: string; body: string }

const urlOf = (route: string, locale: Locale) => `${SITE_URL}${localizePath(route, locale)}`

function alternates(route: string) {
  return [
    ...LOCALES.map((locale) => [locale, urlOf(route, locale)] as const),
    ["x-default", urlOf(route, DEFAULT_LOCALE)] as const,
  ]
}

function head({ route, locale, title, description }: Page) {
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${OG_LOCALES[locale]}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    ...(SITE_URL
      ? [
          `<meta property="og:url" content="${urlOf(route, locale)}" />`,
          `<link rel="canonical" href="${urlOf(route, locale)}" />`,
          ...alternates(route).map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${href}" />`),
        ]
      : []),
  ].join("\n    ")
}

function render(template: string, page: Page) {
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${page.locale}">`)
    .replace(/\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace("</head>", `  ${head(page)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`)
}

const link = (route: string, locale: Locale, label: string) =>
  `<a href="${localizePath(route, locale)}">${escapeHtml(label)}</a>`

function otherLanguages(route: string, locale: Locale) {
  return LOCALES.filter((other) => other !== locale)
    .map(
      (other) =>
        `<p><a href="${localizePath(route, other)}" hreflang="${other}" lang="${other}">${LOCALE_NAMES[other]}</a></p>`,
    )
    .join("")
}

function homeBody(locale: Locale) {
  const { site, home } = ui[locale]
  const list = tools
    .map((tool) => `<li>${link(`/${tool.id}`, locale, tool.name)}: ${escapeHtml(tool.description[locale])}</li>`)
    .join("")
  return `<main class="sr-only"><h1>${escapeHtml(home.title)}</h1><p>${escapeHtml(site.description)}</p><ul>${list}</ul>${otherLanguages("/", locale)}</main>`
}

function toolBody(tool: Tool, locale: Locale) {
  const { tool: toolText, folder } = ui[locale]
  const content = about[tool.id]?.[locale]
  const category = CATEGORIES[tool.category].name
  const related = toolsByCategory[tool.category]
    .filter(({ id }) => id !== tool.id)
    .map((other) => `<li>${link(`/${other.id}`, locale, other.name)}</li>`)
    .join("")
  return [
    `<main class="sr-only"><p>${escapeHtml(category)}</p><h1>${escapeHtml(tool.name)}</h1><p>${escapeHtml(tool.description[locale])}</p>`,
    content &&
      `<h2>${escapeHtml(toolText.about(tool.name))}</h2><p>${escapeHtml(content.intro)}</p><h3>${escapeHtml(toolText.uses)}</h3><ul>${content.uses.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul><p>${escapeHtml(toolText.privacy)}</p>`,
    related && `<h2>${escapeHtml(folder.otherTools(category))}</h2><ul>${related}</ul>`,
    otherLanguages(`/${tool.id}`, locale),
    "</main>",
  ]
    .filter(Boolean)
    .join("")
}

const pages: Page[] = LOCALES.flatMap((locale) => [
  {
    route: "/",
    locale,
    title: pageTitle(locale),
    description: ui[locale].site.description,
    body: homeBody(locale),
  },
  ...tools.map((tool) => ({
    route: `/${tool.id}`,
    locale,
    title: pageTitle(locale, tool.name),
    description: tool.description[locale],
    body: toolBody(tool, locale),
  })),
])

// GitHub Pages menyajikan /uuid dari uuid.html tanpa redirect; /en/ dari en/index.html
const fileOf = ({ route, locale }: Page) => {
  const path = localizePath(route, locale)
  return join(DIST, path.endsWith("/") ? `${path}index.html` : `${path}.html`)
}

const template = await readFile(join(DIST, "index.html"), "utf8")

await writeFile(
  join(DIST, "404.html"),
  template.replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>'),
)

for (const page of pages) {
  const file = fileOf(page)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, render(template, page))
}

const robots = ["User-agent: *", "Allow: /", SITE_URL && `Sitemap: ${SITE_URL}/sitemap.xml`].filter(Boolean)
await writeFile(join(DIST, "robots.txt"), `${robots.join("\n")}\n`)

if (SITE_URL) {
  const urls = pages
    .map((page) => {
      const links = alternates(page.route)
        .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
        .join("")
      return `  <url><loc>${urlOf(page.route, page.locale)}</loc>${links}</url>`
    })
    .join("\n")
  await writeFile(
    join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  )
}

console.log(
  `prerender: ${pages.length} halaman${SITE_URL ? `, sitemap untuk ${SITE_URL}` : " (set SITE_URL untuk canonical dan sitemap)"}`,
)

import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ui } from "../src/i18n/ui"
import { pageTitle, SITE_NAME } from "../src/lib/meta"
import { CATEGORIES, type Tool } from "../src/lib/tool"
import { about } from "../src/tools/about"
import { tools, toolsByCategory } from "../src/tools/registry"

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist")
const SITE_URL = process.env.SITE_URL?.replace(/\/$/, "")

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

type Page = { path: string; title: string; description: string; body: string }

function head({ path, title, description }: Page) {
  const url = SITE_URL ? `${SITE_URL}${path}` : undefined
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    url && `<meta property="og:url" content="${url}" />`,
    url && `<link rel="canonical" href="${url}" />`,
  ]
    .filter(Boolean)
    .join("\n    ")
}

function render(template: string, page: Page) {
  return template
    .replace(/\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace("</head>", `  ${head(page)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`)
}

const { site, home, tool: toolText, folder } = ui.id

const toolList = tools
  .map((tool) => `<li><a href="/${tool.id}">${escapeHtml(tool.name)}</a>: ${escapeHtml(tool.description.id)}</li>`)
  .join("")

function toolBody(tool: Tool) {
  const content = about[tool.id]?.id
  const category = CATEGORIES[tool.category].name
  const related = toolsByCategory[tool.category]
    .filter(({ id }) => id !== tool.id)
    .map((other) => `<li><a href="/${other.id}">${escapeHtml(other.name)}</a></li>`)
    .join("")
  return [
    `<main class="sr-only"><p>${escapeHtml(category)}</p><h1>${escapeHtml(tool.name)}</h1><p>${escapeHtml(tool.description.id)}</p>`,
    content &&
      `<h2>${escapeHtml(toolText.about(tool.name))}</h2><p>${escapeHtml(content.intro)}</p><h3>${escapeHtml(toolText.uses)}</h3><ul>${content.uses.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul><p>${escapeHtml(toolText.privacy)}</p>`,
    related && `<h2>${escapeHtml(folder.otherTools(category))}</h2><ul>${related}</ul>`,
    "</main>",
  ]
    .filter(Boolean)
    .join("")
}

const pages: Page[] = [
  {
    path: "/",
    title: pageTitle("id"),
    description: site.description,
    body: `<main class="sr-only"><h1>${escapeHtml(home.title)}</h1><p>${escapeHtml(site.description)}</p><ul>${toolList}</ul></main>`,
  },
  ...tools.map((tool) => ({
    path: `/${tool.id}`,
    title: pageTitle("id", tool.name),
    description: tool.description.id,
    body: toolBody(tool),
  })),
]

const template = await readFile(join(DIST, "index.html"), "utf8")

await writeFile(join(DIST, "404.html"), template)

// GitHub Pages menyajikan /uuid dari uuid.html tanpa redirect, sesuai canonical; uuid/index.html memicu 301 ke /uuid/
for (const page of pages) {
  const file = page.path === "/" ? join(DIST, "index.html") : join(DIST, `${page.path}.html`)
  await writeFile(file, render(template, page))
}

const robots = ["User-agent: *", "Allow: /", SITE_URL && `Sitemap: ${SITE_URL}/sitemap.xml`].filter(Boolean)
await writeFile(join(DIST, "robots.txt"), `${robots.join("\n")}\n`)

if (SITE_URL) {
  const urls = pages.map((page) => `  <url><loc>${SITE_URL}${page.path}</loc></url>`).join("\n")
  await writeFile(
    join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
}

console.log(
  `prerender: ${pages.length} halaman${SITE_URL ? `, sitemap untuk ${SITE_URL}` : " (set SITE_URL untuk canonical dan sitemap)"}`,
)

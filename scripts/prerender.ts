import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ui } from "../src/i18n/ui"
import { pageTitle, SITE_NAME } from "../src/lib/meta"
import { CATEGORIES } from "../src/lib/tool"
import { tools } from "../src/tools/registry"

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

const { site, home } = ui.id

const toolList = tools
  .map((tool) => `<li><a href="/${tool.id}">${escapeHtml(tool.name)}</a>: ${escapeHtml(tool.description.id)}</li>`)
  .join("")

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
    body: `<main class="sr-only"><p>${escapeHtml(CATEGORIES[tool.category].name)}</p><h1>${escapeHtml(tool.name)}</h1><p>${escapeHtml(tool.description.id)}</p></main>`,
  })),
]

const template = await readFile(join(DIST, "index.html"), "utf8")

for (const page of pages) {
  const file = page.path === "/" ? join(DIST, "index.html") : join(DIST, page.path, "index.html")
  await mkdir(dirname(file), { recursive: true })
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

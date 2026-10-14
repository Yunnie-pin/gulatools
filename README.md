# GulaTools

A collection of developer tools that run entirely in the browser. Nothing you paste, type, or upload is sent to a server.

Live site: https://devtools.gulagulali.tech

## Features

- 34 tools across formatting, conversion, encoding, cryptography, generation, and text processing
- Fully client-side: hashing, encryption, key generation, and parsing happen locally
- Works offline as an installable PWA
- Command palette (`Ctrl+K` / `Cmd+K`) for jumping between tools
- Favorites and recently used tools, stored in the browser
- Shareable links: tool input is compressed into the URL fragment, which browsers never send to the server
- English and Bahasa Indonesia interface
- Light and dark themes
- Prerendered pages with per-tool titles, descriptions, canonical URLs, and a sitemap

## Tools

| Category | Tool | Description |
|---|---|---|
| Formatter | JSON Formatter | Format, minify, and validate JSON |
| | Code Formatter | Format JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, and YAML with Prettier |
| | SQL Formatter | Format SQL for PostgreSQL, MySQL, SQLite, SQL Server, and more |
| Converter | Data Converter | Convert between JSON, YAML, TOML, XML, and CSV |
| | JSON to TypeScript | Generate TypeScript interfaces or Zod schemas from sample JSON |
| | JSONPath | Query JSON with JSONPath expressions |
| | Timestamp | Convert Unix timestamps (seconds to nanoseconds) to dates and back |
| | Cron Parser | Explain cron expressions in plain language and list the next runs |
| | Color Converter | Convert between HEX, RGB, HSL, and OKLCH, with a WCAG contrast check |
| Encoder | Base64 | Encode and decode Base64, including the URL-safe variant |
| | URL Encoder | Percent-encode and decode URLs and query strings |
| | Image & Base64 | Convert images to data URIs, or preview Base64 as an image |
| | QR Code | Create QR codes (PNG/SVG) or read one from an image |
| Crypto | JWT | Decode, verify, and sign JWTs with HMAC, RSA, ECDSA, or EdDSA |
| | Bcrypt | Create bcrypt hashes and check passwords against them |
| | Argon2 & scrypt | Hash passwords with Argon2id/i/d or scrypt, and verify Argon2 hashes |
| | Hash Generator | MD5, SHA-1, SHA-256, SHA-384, and SHA-512 of text or files |
| | HMAC Generator | HMAC with SHA-1, SHA-256, SHA-384, or SHA-512 |
| | AES Encrypt | AES-256-GCM encryption with a PBKDF2-derived key |
| | Key Generator | RSA, ECDSA, or Ed25519 key pairs in PEM and JWK |
| Generator | Password Generator | Strong random passwords with an entropy estimate |
| | UUID / ULID | Bulk UUID v4, UUID v7, or ULID |
| Text | Regex Tester | Test JavaScript regular expressions with live matches and replacements |
| | Text Diff | Compare two texts and copy the result as a unified patch |
| | Case Converter | camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more |

## Tech stack

- React 19, React Router, TypeScript
- Vite with `vite-plugin-pwa`
- Tailwind CSS 4
- CodeMirror for code inputs
- Web Workers (via Comlink) for slow operations such as bcrypt and Argon2
- Biome for linting and formatting
- Vitest for unit tests, Playwright with axe-core for end-to-end and accessibility tests

## Getting started

Requires Node.js 24.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check, build, and prerender all pages into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check code with Biome |
| `npm run format` | Fix lint and formatting issues with Biome |
| `npm run typecheck` | Run the TypeScript compiler without emitting |
| `npm test` | Run unit tests with Vitest |
| `npm run e2e` | Run end-to-end tests with Playwright |

Before running end-to-end tests for the first time, install the browser:

```bash
npx playwright install chromium
```

## Project structure

```
src/
  app/         Layout, routing pages, sidebar, command palette
  components/  Shared UI components
  i18n/        Locale handling and interface strings
  lib/         Shared utilities (storage, sharing, theme, formatting)
  tools/       One folder per tool
    registry.ts  List of all tools
scripts/
  prerender.ts Generates static HTML, robots.txt, and sitemap.xml after the build
e2e/           Playwright tests
```

Each tool folder usually contains:

- `index.ts`: metadata (id, name, localized description, category, keywords, icon) and a lazily loaded component
- `Tool.tsx`: the user interface
- `logic.ts` and `logic.test.ts`: pure logic and its unit tests
- `messages.ts`: localized strings specific to the tool

## Adding a tool

1. Create a folder under `src/tools/` following the layout above.
2. Export a `Tool` object from its `index.ts`. The `id` becomes the URL path, for example `/my-tool`.
3. Add it to the `tools` array in `src/tools/registry.ts`.

The route, sidebar entry, command palette entry, prerendered page, and sitemap entry are all generated from the registry.

## Deployment

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The workflow:

1. Builds with `SITE_URL` set, which enables canonical URLs and `sitemap.xml` in the prerender step.
2. Copies `index.html` to `404.html` so unknown paths fall back to the app.
3. Publishes `dist/` to GitHub Pages.

The custom domain is set in `public/CNAME`. DNS is managed in Cloudflare with a `CNAME` record pointing `devtools` to `<github-username>.github.io`.

To build for a different domain:

```bash
SITE_URL=https://example.com npm run build
```

## License

[MIT](LICENSE)

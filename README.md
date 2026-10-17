# GulaTools

A collection of developer tools that run entirely in the browser. Nothing you paste, type, or upload is sent to a server.

Live site: https://devtools.gulagulali.tech

## Features

- 38 tools across formatting, conversion, encoding, cryptography, generation, and text processing
- Fully client-side: hashing, encryption, key generation, and parsing happen locally
- Works offline as an installable PWA
- Command palette (`Ctrl+K` / `Cmd+K`) for jumping between tools
- Favorites and recently used tools, stored in the browser
- Shareable links: tool input is compressed into the URL fragment, which browsers never send to the server
- English and Bahasa Indonesia interface
- Light and dark glassmorphism themes with selectable character backgrounds and slowly rotating orbits (paused when the system asks for reduced motion)
- Prerendered pages with per-tool titles, descriptions, canonical URLs, and a sitemap
- No network requests leave the origin; external images in Markdown are blocked and the Docker image ships a strict Content Security Policy

## Tools

| Category | Tool | Description |
|---|---|---|
| Formatter | JSON Formatter | Format, minify, and validate JSON |
| | Code Formatter | Format JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, and YAML with Prettier |
| | SQL Formatter | Format SQL for PostgreSQL, MySQL, SQLite, SQL Server, and more |
| | Markdown Preview | Live GitHub Flavored Markdown preview with sanitized HTML output |
| | SVG Optimizer | Shrink SVGs with SVGO, with precision control and a preview |
| | JSON Schema Validator | Validate JSON against draft-07, 2019-09, or 2020-12 schemas and list every error |
| Converter | Data Converter | Convert between JSON, YAML, TOML, XML, and CSV |
| | JSON to TypeScript | Generate TypeScript interfaces or Zod schemas from sample JSON |
| | JSONPath | Query JSON with JSONPath expressions |
| | Timestamp | Convert Unix timestamps (seconds to nanoseconds) to dates and back |
| | Number Base | Convert between binary, octal, decimal, and hex with BigInt precision and two's complement |
| | Chmod Calculator | Unix permissions in octal and symbolic form, including setuid, setgid, and sticky |
| | Subnet Calculator | IPv4 network, broadcast, netmask, and host range from CIDR or a netmask |
| | Cron Parser | Explain cron expressions in plain language and list the next runs |
| | Color Converter | Convert between HEX, RGB, HSL, and OKLCH, with a WCAG contrast check |
| | Contrast Checker | WCAG AA/AAA contrast between any text and background color, with a preview |
| | Image Compressor | Resize, compress, and convert images to WebP, JPEG, or PNG |
| Encoder | Base64 | Encode and decode Base64, including the URL-safe variant |
| | URL Encoder | Percent-encode and decode URLs and query strings |
| | HTML Entity | Escape HTML special characters and decode named or numeric entities |
| | Text Escape | Escape text for JSON strings, regex patterns, shell arguments, or SQL literals |
| | Image & Base64 | Convert images to data URIs, or preview Base64 as an image |
| | QR Code | Create QR codes (PNG/SVG) or read one from an image |
| Crypto | JWT | Decode, verify, and sign JWTs with HMAC, RSA, ECDSA, or EdDSA |
| | Bcrypt | Create bcrypt hashes and check passwords against them |
| | Argon2 & scrypt | Hash passwords with Argon2id/i/d or scrypt, and verify Argon2 hashes |
| | Hash Generator | MD5, SHA-1, SHA-256, SHA-384, and SHA-512 of text or files |
| | HMAC Generator | HMAC with SHA-1, SHA-256, SHA-384, or SHA-512 |
| | AES Encrypt | AES-256-GCM encryption with a PBKDF2-derived key |
| | Key Generator | RSA, ECDSA, or Ed25519 key pairs in PEM and JWK |
| | X.509 Decoder | Inspect PEM/DER certificates and chains: subject, validity, SAN, key usage, fingerprints |
| Generator | Password Generator | Strong random passwords with an entropy estimate |
| | UUID / ULID | Bulk UUID v4, UUID v7, or ULID |
| | Lorem Ipsum | Placeholder text by paragraphs, sentences, or words |
| Text | Regex Tester | Test JavaScript regular expressions with live matches and replacements |
| | Text Diff | Compare two texts and copy the result as a unified patch |
| | Case Converter | camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more |
| | Text Stats | Count characters, words, lines, and bytes, and find hidden characters such as zero-width spaces or bidi controls |

## Tech stack

- React 19, React Router, TypeScript
- Vite with `vite-plugin-pwa`
- Tailwind CSS 4
- CodeMirror for code inputs
- Web Workers (via Comlink) for slow operations such as bcrypt and Argon2
- marked and DOMPurify for Markdown, Ajv for JSON Schema, SVGO for SVG optimization; heavy libraries load only on the page that uses them
- Biome for linting and formatting
- Vitest for unit tests, Playwright with axe-core for end-to-end and accessibility tests

## Getting started

Requires Node.js 24 or newer.

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

## Docker

The `Dockerfile` builds the site with Node and serves `dist/` from an unprivileged nginx image. `docker/nginx.conf` serves the prerendered pages, falls back to the app for unknown paths, caches hashed assets for a year, gzips text assets, and sends security headers (CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and more).

```bash
docker compose up -d --build                                            # http://localhost:8080
PORT=3000 docker compose up -d --build                                  # different port
SITE_URL=https://example.com docker compose up -d --build               # canonical URLs and sitemap
docker compose down
```

`compose.yaml` runs the container with a read-only filesystem, all Linux capabilities dropped, `no-new-privileges`, and a health check.

## Security and dependencies

- `.github/workflows/security.yml` runs on every push to `main`, on pull requests, and weekly:
  - `npm audit` fails on vulnerabilities of moderate severity or higher, and `npm audit signatures` verifies package provenance
  - CodeQL scans the code with the `security-extended` query suite; findings appear under the repository's Security tab
  - Dependency review blocks pull requests that add vulnerable dependencies
- Dependabot (`.github/dependabot.yml`) opens weekly update pull requests for npm packages, GitHub Actions, and Docker base images. A 14-day cooldown means a version is only proposed after it has been public for two weeks, which lowers the risk of pulling in a compromised release. Minor and patch npm updates are grouped into one pull request for runtime and one for development dependencies.

## License

[MIT](LICENSE)

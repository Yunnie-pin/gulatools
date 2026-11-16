import { parseUserAgent } from "../user-agent/logic"

export type DeviceInfo = {
  screen: string
  viewport: string
  pixelRatio: string
  colorDepth: string
  portrait: boolean
  cores: string
  memory: string
  touchPoints: string
  browser: string
  os: string
  languages: string
  timeZone: string
  dark: boolean
  reducedMotion: boolean
  online: boolean
  cookies: boolean
  userAgent: string
}

type NavigatorWithMemory = Navigator & { deviceMemory?: number }

const size = (width: number, height: number) => `${width} × ${height}`

const prefers = (query: string) => window.matchMedia(`(prefers-${query})`).matches

export function readDevice(): DeviceInfo {
  const nav: NavigatorWithMemory = navigator
  const { browser, os } = parseUserAgent(nav.userAgent)
  return {
    screen: size(screen.width, screen.height),
    viewport: size(window.innerWidth, window.innerHeight),
    pixelRatio: String(window.devicePixelRatio),
    colorDepth: `${screen.colorDepth}-bit`,
    portrait: window.matchMedia("(orientation: portrait)").matches,
    cores: nav.hardwareConcurrency ? String(nav.hardwareConcurrency) : "",
    memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "",
    touchPoints: String(nav.maxTouchPoints),
    browser,
    os,
    languages: nav.languages.join(", "),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dark: prefers("color-scheme: dark"),
    reducedMotion: prefers("reduced-motion: reduce"),
    online: nav.onLine,
    cookies: nav.cookieEnabled,
    userAgent: nav.userAgent,
  }
}

export function cleanRenderer(renderer: string): string {
  const angle = /^ANGLE \([^,]+, (.+?)(?:, [^,]+)?\)$/.exec(renderer)
  const name = angle?.[1] ?? renderer
  return name.replace(/^ANGLE \w+ Renderer: /, "").replace(/\s+(\(0x[0-9a-f]+\)|Direct3D|OpenGL|Vulkan).*$/i, "")
}

export function readGpu(): string {
  const gl = document.createElement("canvas").getContext("webgl")
  if (!gl) return ""
  const debug = gl.getExtension("WEBGL_debug_renderer_info")
  const renderer: unknown = gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER)
  gl.getExtension("WEBGL_lose_context")?.loseContext()
  return typeof renderer === "string" ? cleanRenderer(renderer) : ""
}

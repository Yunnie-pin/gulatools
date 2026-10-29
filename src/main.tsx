import { LucideProvider } from "lucide-react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { Home } from "./app/Home"
import { Layout } from "./app/Layout"
import { NotFound } from "./app/NotFound"
import { RouteError } from "./app/RouteError"
import { ToolPage } from "./app/ToolPage"
import { getLocale, routerBasename } from "./i18n/locale"
import { ThemeProvider } from "./lib/theme"
import { tools } from "./tools/registry"
import "./styles/index.css"
import { registerSW } from "virtual:pwa-register"

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          errorElement: <RouteError />,
          children: [
            { index: true, element: <Home /> },
            ...tools.map((tool) => ({ path: tool.id, element: <ToolPage tool={tool} /> })),
            { path: "*", element: <NotFound /> },
          ],
        },
      ],
    },
  ],
  { basename: routerBasename(getLocale()) },
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LucideProvider strokeWidth={1.75}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LucideProvider>
  </StrictMode>,
)

const UPDATE_CHECK_MS = 60 * 60 * 1000

// autoUpdate: reload otomatis begitu service worker versi baru aktif
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    const checkForUpdate = () => {
      if (document.visibilityState === "visible" && navigator.onLine) registration.update().catch(() => {})
    }
    setInterval(checkForUpdate, UPDATE_CHECK_MS)
    document.addEventListener("visibilitychange", checkForUpdate)
  },
})

import { LucideProvider } from "lucide-react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { Home } from "./app/Home"
import { Layout } from "./app/Layout"
import { NotFound } from "./app/NotFound"
import { RouteError } from "./app/RouteError"
import { ToolPage } from "./app/ToolPage"
import { ThemeProvider } from "./lib/theme"
import { tools } from "./tools/registry"
import "./styles/index.css"

const router = createBrowserRouter([
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
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LucideProvider strokeWidth={1.75}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LucideProvider>
  </StrictMode>,
)

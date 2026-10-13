import { RefreshCw, TriangleAlert } from "lucide-react"
import { useRouteError } from "react-router"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { errorMessage } from "@/lib/result"

export function RouteError() {
  const error = useRouteError()

  return (
    <GlassPanel className="mx-auto mt-16 flex max-w-md flex-col items-center gap-3 px-8 py-10 text-center">
      <TriangleAlert aria-hidden="true" className="size-10 text-danger" />
      <h1 className="text-2xl font-semibold">Tool gagal dimuat</h1>
      <p className="text-sm text-ink-soft">
        Biasanya karena ada versi baru GulaTools. Muat ulang halaman untuk mengambil versi terbaru.
      </p>
      <code className="font-mono text-xs break-all text-danger">{errorMessage(error)}</code>
      <GlassButton variant="key" onClick={() => window.location.reload()}>
        <RefreshCw aria-hidden="true" className="size-4" />
        Muat ulang
      </GlassButton>
    </GlassPanel>
  )
}

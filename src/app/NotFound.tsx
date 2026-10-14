import { Link } from "react-router"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { usePageMeta } from "@/lib/meta"

export function NotFound() {
  const t = useMessages(ui).notFound
  usePageMeta(t.meta)

  return (
    <GlassPanel className="mx-auto mt-16 flex max-w-md flex-col items-center gap-3 px-8 py-10 text-center">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <Link to="/" className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
        {t.back}
      </Link>
    </GlassPanel>
  )
}

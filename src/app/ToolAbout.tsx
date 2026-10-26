import { ShieldCheck } from "lucide-react"
import { Link } from "react-router"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { CATEGORIES, type Tool } from "@/lib/tool"
import { about } from "@/tools/about"
import { toolsByCategory } from "@/tools/registry"

export default function ToolAbout({ tool }: { tool: Tool }) {
  const locale = useLocale()
  const content = about[tool.id]?.[locale]
  if (!content) return null

  const t = ui[locale]
  const related = toolsByCategory[tool.category].filter(({ id }) => id !== tool.id)

  return (
    <GlassPanel className="flex flex-col gap-5 px-5 py-5 text-sm sm:px-6">
      <section aria-labelledby="about-heading" className="flex flex-col gap-2">
        <h2 id="about-heading" className="text-base font-semibold">
          {t.tool.about(tool.name)}
        </h2>
        <p className="text-ink-soft">{content.intro}</p>
        <h3 className="mt-2 font-semibold">{t.tool.uses}</h3>
        <ul className="list-disc space-y-1 pl-5 text-ink-soft">
          {content.uses.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
        <p className="mt-2 flex items-center gap-2 text-ink-soft">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
          {t.tool.privacy}
        </p>
      </section>
      {related.length > 0 && (
        <nav aria-labelledby="related-heading" className="flex flex-col gap-2">
          <h2 id="related-heading" className="text-base font-semibold">
            {t.folder.otherTools(CATEGORIES[tool.category].name)}
          </h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {related.map((other) => (
              <li key={other.id}>
                <Link to={`/${other.id}`} className="text-ink-soft underline underline-offset-4 hover:text-ink">
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </GlassPanel>
  )
}

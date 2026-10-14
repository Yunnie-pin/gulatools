import { LayoutGrid, Star, UserRound } from "lucide-react"
import { GlassFolder } from "@/components/glass/GlassFolder"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { SectionHeading } from "@/components/SectionHeading"
import { type Locale, localize, useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { usePageMeta } from "@/lib/meta"
import { CATEGORIES, CATEGORY_IDS, type Tool } from "@/lib/tool"
import { useUsage } from "@/lib/usage"
import { resolveTools, toolsByCategory } from "@/tools/registry"
import { ContinueStrip } from "./ContinueStrip"

const FOLDER_WIDTH = 300
const FOLDER_GRID = "flex flex-wrap justify-center gap-x-8 gap-y-4 lg:justify-start"

const toFiles = (tools: Tool[], locale: Locale) =>
  tools.map((tool) => ({ name: tool.name, meta: localize(tool.short, locale), to: `/${tool.id}`, icon: tool.icon }))

export function Home() {
  const { favorites, recent } = useUsage()
  const favoriteTools = resolveTools(favorites)
  const hasPersonal = favoriteTools.length > 0 || recent.length > 0
  const locale = useLocale()
  const t = ui[locale].home
  usePageMeta()

  return (
    <div className="flex flex-col gap-10">
      <GlassPanel className="px-6 py-8 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-3 max-w-xl text-ink-soft">{t.lead}</p>
      </GlassPanel>

      {hasPersonal && (
        <section aria-labelledby="personal-heading" className="flex flex-col gap-5">
          <SectionHeading id="personal-heading" icon={UserRound}>
            {t.yours}
          </SectionHeading>
          <ContinueStrip />
          {favoriteTools.length > 0 && (
            <div className={FOLDER_GRID}>
              <GlassFolder
                label={ui[locale].shell.favorites}
                icon={Star}
                accent="amber"
                width={FOLDER_WIDTH}
                files={toFiles(favoriteTools, locale)}
              />
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="categories-heading" className="flex flex-col gap-5">
        <SectionHeading id="categories-heading" icon={LayoutGrid}>
          {t.categories}
        </SectionHeading>
        <div className={FOLDER_GRID}>
          {CATEGORY_IDS.map((id, i) => {
            const tools = toolsByCategory[id]
            return (
              <GlassFolder
                key={id}
                label={CATEGORIES[id].name}
                meta={tools.length ? undefined : t.comingSoon}
                width={FOLDER_WIDTH}
                appearDelay={i * 80}
                files={toFiles(tools, locale)}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}

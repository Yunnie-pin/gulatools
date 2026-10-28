import { LayoutGrid, Star, UserRound } from "lucide-react"
import { GlassFolder } from "@/components/glass/GlassFolder"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { SectionHeading } from "@/components/SectionHeading"
import { type Locale, localize, useLocale } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { BACKGROUND_FOCUS, backgroundSrcSet, backgroundUrl } from "@/lib/backgrounds"
import { usePageMeta } from "@/lib/meta"
import { useTheme } from "@/lib/theme"
import { CATEGORIES, CATEGORY_IDS, type Tool } from "@/lib/tool"
import { useUsage } from "@/lib/usage"
import { resolveTools, toolsByCategory } from "@/tools/registry"
import { ContinueStrip } from "./ContinueStrip"

const FOLDER_WIDTH = 260
const FOLDER_GAP = 32
const FOLDER_GRID = "flex flex-wrap justify-center gap-y-4 lg:justify-start"
const folderGridStyle = { columnGap: FOLDER_GAP, maxWidth: 3 * FOLDER_WIDTH + 2 * FOLDER_GAP }

const toFiles = (tools: Tool[], locale: Locale) =>
  tools.map((tool) => ({ name: tool.name, meta: localize(tool.short, locale), to: `/${tool.id}`, icon: tool.icon }))

export function Home() {
  const { favorites, recent } = useUsage()
  const favoriteTools = resolveTools(favorites)
  const hasPersonal = favoriteTools.length > 0 || recent.length > 0
  const locale = useLocale()
  const t = ui[locale].home
  const { background } = useTheme()
  usePageMeta()

  return (
    <div className="flex flex-col gap-10">
      <GlassPanel className="relative overflow-hidden px-6 py-8 sm:px-10">
        <img
          key={background}
          src={backgroundUrl(background)}
          srcSet={backgroundSrcSet(background)}
          sizes="100vw"
          alt=""
          decoding="async"
          style={{ objectPosition: BACKGROUND_FOCUS[background] }}
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 animate-[fade-in_.8s_var(--ease)] object-cover [mask-image:linear-gradient(to_right,transparent,black_45%)] md:block"
        />
        <div className="relative md:max-w-[52%]">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-3 max-w-xl text-ink-soft">{t.lead}</p>
        </div>
      </GlassPanel>

      {hasPersonal && (
        <section aria-labelledby="personal-heading" className="flex flex-col gap-5">
          <SectionHeading id="personal-heading" icon={UserRound}>
            {t.yours}
          </SectionHeading>
          <ContinueStrip />
          {favoriteTools.length > 0 && (
            <div className={FOLDER_GRID} style={folderGridStyle}>
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
        <div className={FOLDER_GRID} style={folderGridStyle}>
          {CATEGORY_IDS.map((id, i) => {
            const tools = toolsByCategory[id]
            return (
              <GlassFolder
                key={id}
                label={CATEGORIES[id].name}
                icon={CATEGORIES[id].icon}
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

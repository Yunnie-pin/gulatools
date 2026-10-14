import { LayoutGrid, Star, UserRound } from "lucide-react"
import { GlassFolder } from "@/components/glass/GlassFolder"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { SectionHeading } from "@/components/SectionHeading"
import { usePageMeta } from "@/lib/meta"
import { CATEGORIES, CATEGORY_IDS, type Tool } from "@/lib/tool"
import { useUsage } from "@/lib/usage"
import { resolveTools, toolsByCategory } from "@/tools/registry"
import { ContinueStrip } from "./ContinueStrip"

const FOLDER_WIDTH = 300
const FOLDER_GRID = "flex flex-wrap justify-center gap-x-8 gap-y-4 lg:justify-start"

const toFiles = (tools: Tool[]) =>
  tools.map((tool) => ({ name: tool.name, meta: tool.short, to: `/${tool.id}`, icon: tool.icon }))

export function Home() {
  const { favorites, recent } = useUsage()
  const favoriteTools = resolveTools(favorites)
  const hasPersonal = favoriteTools.length > 0 || recent.length > 0
  usePageMeta()

  return (
    <div className="flex flex-col gap-10">
      <GlassPanel className="px-6 py-8 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Developer tools, langsung di browser.</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Format, parse, encode, dan hash tanpa server. Data kamu tidak pernah meninggalkan perangkat ini.
        </p>
      </GlassPanel>

      {hasPersonal && (
        <section aria-labelledby="personal-heading" className="flex flex-col gap-5">
          <SectionHeading id="personal-heading" icon={UserRound}>
            Milikmu
          </SectionHeading>
          <ContinueStrip />
          {favoriteTools.length > 0 && (
            <div className={FOLDER_GRID}>
              <GlassFolder
                label="Favorit"
                icon={Star}
                accent="amber"
                width={FOLDER_WIDTH}
                files={toFiles(favoriteTools)}
              />
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="categories-heading" className="flex flex-col gap-5">
        <SectionHeading id="categories-heading" icon={LayoutGrid}>
          Kategori
        </SectionHeading>
        <div className={FOLDER_GRID}>
          {CATEGORY_IDS.map((id, i) => {
            const tools = toolsByCategory[id]
            return (
              <GlassFolder
                key={id}
                label={CATEGORIES[id].name}
                meta={tools.length ? undefined : "Segera hadir"}
                width={FOLDER_WIDTH}
                appearDelay={i * 80}
                files={toFiles(tools)}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}

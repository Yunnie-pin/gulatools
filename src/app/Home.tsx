import { GlassFolder } from "@/components/glass/GlassFolder"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { CATEGORIES, CATEGORY_IDS } from "@/lib/tool"
import { toolsByCategory } from "@/tools/registry"

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <GlassPanel className="px-6 py-8 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Developer tools, langsung di browser.</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Format, parse, encode, dan hash tanpa server. Data kamu tidak pernah meninggalkan perangkat ini.
        </p>
      </GlassPanel>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 lg:justify-start">
        {CATEGORY_IDS.map((id, i) => {
          const tools = toolsByCategory[id]
          return (
            <GlassFolder
              key={id}
              label={CATEGORIES[id].name}
              meta={tools.length ? undefined : "Segera hadir"}
              width={300}
              appearDelay={i * 80}
              files={tools.map((tool) => ({ name: tool.name, meta: tool.short, to: `/${tool.id}`, icon: tool.icon }))}
            />
          )
        })}
      </div>
    </div>
  )
}

import { Cpu, Globe, type LucideIcon, Monitor } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { CopyButton } from "@/components/CopyButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { SectionHeading } from "@/components/SectionHeading"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { readDevice, readGpu } from "./logic"
import { messages } from "./messages"

type Section = { id: string; title: string; icon: LucideIcon; rows: [label: string, value: string][] }

const EVENTS = ["resize", "online", "offline"] as const

const QUERIES = ["(orientation: portrait)", "(prefers-color-scheme: dark)", "(prefers-reduced-motion: reduce)"]

function useDevice() {
  const [device, setDevice] = useState(readDevice)

  useEffect(() => {
    const refresh = () => setDevice(readDevice())
    const media = QUERIES.map((query) => window.matchMedia(query))
    for (const event of EVENTS) window.addEventListener(event, refresh)
    for (const query of media) query.addEventListener("change", refresh)
    return () => {
      for (const event of EVENTS) window.removeEventListener(event, refresh)
      for (const query of media) query.removeEventListener("change", refresh)
    }
  }, [])

  return device
}

export default function DeviceInfoTool() {
  const t = useMessages(messages)
  const device = useDevice()
  const gpu = useMemo(readGpu, [])
  const yesNo = (value: boolean) => (value ? t.yes : t.no)

  const sections: Section[] = [
    {
      id: "display",
      title: t.display,
      icon: Monitor,
      rows: [
        [t.screen, device.screen],
        [t.viewport, device.viewport],
        [t.pixelRatio, device.pixelRatio],
        [t.colorDepth, device.colorDepth],
        [t.orientation, device.portrait ? t.portrait : t.landscape],
      ],
    },
    {
      id: "hardware",
      title: t.hardware,
      icon: Cpu,
      rows: [
        [t.cores, device.cores],
        [t.memory, device.memory],
        ["GPU", gpu],
        [t.touchPoints, device.touchPoints],
      ],
    },
    {
      id: "system",
      title: t.system,
      icon: Globe,
      rows: [
        ["Browser", device.browser],
        [t.os, device.os],
        [t.languages, device.languages],
        [t.timeZone, device.timeZone],
        [t.colorScheme, device.dark ? t.dark : t.light],
        [t.reducedMotion, yesNo(device.reducedMotion)],
        [t.network, device.online ? t.online : t.offline],
        [t.cookies, yesNo(device.cookies)],
        ["User-Agent", device.userAgent],
      ],
    },
  ]

  const report = sections.flatMap(({ rows }) => rows.map(([label, value]) => `${label}: ${value || "—"}`)).join("\n")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-xs text-ink-soft">{t.privacyHint}</p>
        <CopyButton text={report} shortcut />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`device-${section.id}`} className="flex flex-col gap-2">
            <SectionHeading id={`device-${section.id}`} icon={section.icon}>
              {section.title}
            </SectionHeading>
            <GlassPanel variant="solid" className="px-4 py-1.5">
              {section.rows.map(([label, value]) => (
                <ValueRow key={label} label={label} value={value} />
              ))}
            </GlassPanel>
          </section>
        ))}
      </div>
    </div>
  )
}

import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useId } from "react"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { BACKGROUND_IDS, backgroundThumbUrl } from "@/lib/backgrounds"
import { cx } from "@/lib/cx"
import { type Mode, useTheme } from "@/lib/theme"

const MODES = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "system", label: "Ikuti sistem", icon: Monitor },
  { value: "dark", label: "Gelap", icon: Moon },
] as const satisfies readonly SegmentedOption<Mode>[]

export function ThemeSwitcher({ className }: { className?: string }) {
  const { mode, setMode } = useTheme()
  return (
    <Segmented<Mode>
      label="Tema"
      value={mode}
      options={MODES}
      onChange={setMode}
      iconOnly
      className={cx("w-full", className)}
    />
  )
}

export function ActiveModeIcon({ className }: { className?: string }) {
  const { mode } = useTheme()
  const Icon = MODES.find((m) => m.value === mode)?.icon ?? Monitor
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center rounded-glass-sm bg-black/5 dark:bg-white/5",
        className,
      )}
    >
      <Icon className="size-[18px]" />
    </span>
  )
}

export function BackgroundPicker() {
  const { background, setBackground } = useTheme()
  const name = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <span aria-hidden="true" className="px-1 text-xs font-medium text-ink-soft">
        Latar
      </span>
      <fieldset className="grid grid-cols-4 gap-2 p-1">
        <legend className="sr-only">Latar</legend>
        {BACKGROUND_IDS.map((id, i) => {
          const selected = id === background
          return (
            <label
              key={id}
              className="relative aspect-video cursor-pointer overflow-hidden rounded-md opacity-70 shadow-[inset_0_0_0_1px_rgba(255,255,255,.4)] transition duration-200 ease-glass hover:opacity-100 has-checked:opacity-100 has-checked:ring-2 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
            >
              <input
                type="radio"
                name={name}
                checked={selected}
                onChange={() => setBackground(id)}
                className="sr-only"
              />
              <img
                src={backgroundThumbUrl(id)}
                alt={`Latar ${i + 1}`}
                width={160}
                height={90}
                className="size-full object-cover"
              />
              {selected && (
                <span className="absolute top-0.5 right-0.5 grid size-4 place-items-center rounded-full bg-ink text-white dark:text-black">
                  <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                </span>
              )}
            </label>
          )
        })}
      </fieldset>
    </div>
  )
}

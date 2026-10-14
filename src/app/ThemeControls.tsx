import { Check, type LucideIcon, Monitor, Moon, Sun } from "lucide-react"
import { useId } from "react"
import { Segmented, type SegmentedOption } from "@/components/glass/Segmented"
import { type Locale, setLocale, useLocale, useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { BACKGROUND_IDS, backgroundThumbUrl } from "@/lib/backgrounds"
import { cx } from "@/lib/cx"
import { type Mode, useTheme } from "@/lib/theme"

const MODE_ICONS = { light: Sun, system: Monitor, dark: Moon } as const satisfies Record<Mode, LucideIcon>

const LANGUAGES: readonly SegmentedOption<Locale>[] = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
]

export function ThemeSwitcher({ className }: { className?: string }) {
  const { mode, setMode } = useTheme()
  const t = useMessages(ui).shell
  const modes: SegmentedOption<Mode>[] = [
    { value: "light", label: t.light, icon: MODE_ICONS.light },
    { value: "system", label: t.system, icon: MODE_ICONS.system },
    { value: "dark", label: t.dark, icon: MODE_ICONS.dark },
  ]
  return (
    <Segmented<Mode>
      label={t.theme}
      value={mode}
      options={modes}
      onChange={setMode}
      iconOnly
      className={cx("w-full", className)}
    />
  )
}

export function ActiveModeIcon({ className }: { className?: string }) {
  const { mode } = useTheme()
  const Icon = MODE_ICONS[mode]
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

export function LanguageSwitcher() {
  const locale = useLocale()
  return (
    <Segmented<Locale>
      label={ui[locale].shell.language}
      value={locale}
      options={LANGUAGES}
      onChange={setLocale}
      className="w-full [&>label]:flex-1 [&>label]:justify-center"
    />
  )
}

export function BackgroundPicker() {
  const { background, setBackground } = useTheme()
  const name = useId()
  const t = useMessages(ui).shell

  return (
    <div className="flex flex-col gap-1.5">
      <span aria-hidden="true" className="px-1 text-xs font-medium text-ink-soft">
        {t.background}
      </span>
      <fieldset className="grid grid-cols-4 gap-2 p-1">
        <legend className="sr-only">{t.background}</legend>
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
                alt={t.backgroundN(i + 1)}
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

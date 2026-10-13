import type { LucideIcon } from "lucide-react"
import { useId } from "react"
import { cx } from "@/lib/cx"

export type SegmentedOption<T extends string | number> = { value: T; label: string; icon?: LucideIcon }

type SegmentedProps<T extends string | number> = {
  label: string
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (value: T) => void
  iconOnly?: boolean
  className?: string
}

export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  iconOnly = false,
  className,
}: SegmentedProps<T>) {
  const name = useId()

  return (
    <fieldset className={cx("inline-flex gap-1 rounded-glass-sm bg-black/5 p-1 dark:bg-white/5", className)}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label
          key={String(option.value)}
          title={iconOnly ? option.label : undefined}
          className={cx(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] px-3 py-1 text-sm text-ink-soft transition duration-300 ease-glass hover:text-ink has-checked:bg-white has-checked:text-ink has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-focus dark:has-checked:bg-white/15",
            iconOnly && "flex-1 justify-center px-0 py-1.5",
          )}
        >
          <input
            type="radio"
            name={name}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.icon && <option.icon aria-hidden="true" className="size-4" />}
          <span className={iconOnly ? "sr-only" : undefined}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}

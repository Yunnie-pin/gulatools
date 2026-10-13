import type { ReactNode } from "react"
import { Field } from "./Field"

type RangeFieldProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format?: (value: number) => string
  hint?: ReactNode
  onChange: (value: number) => void
}

export function RangeField({ label, value, min, max, step = 1, format = String, hint, onChange }: RangeFieldProps) {
  return (
    <Field label={`${label}: ${format(value)}`} hint={hint}>
      {(id) => (
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="accent-focus"
        />
      )}
    </Field>
  )
}

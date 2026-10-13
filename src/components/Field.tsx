import { type ReactNode, useId } from "react"

type FieldProps = {
  label: string
  hint?: ReactNode
  children: (id: string) => ReactNode
}

export function Field({ label, hint, children }: FieldProps) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      {children(id)}
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </div>
  )
}

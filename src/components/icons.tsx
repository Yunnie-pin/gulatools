type IconProps = { className?: string }

export function MoreIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="1" y="1.5" width="8" height="9" rx="3.4" />
      <rect x="11" y="1.5" width="8" height="9" rx="3.4" />
      <rect x="21" y="1.5" width="8" height="9" rx="3.4" />
    </svg>
  )
}

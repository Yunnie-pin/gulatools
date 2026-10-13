import { Link } from "react-router"
import { cx } from "@/lib/cx"

type LogoProps = {
  labelClassName?: string
  onClick?: () => void
}

export function Logo({ labelClassName, onClick }: LogoProps) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 rounded-glass-sm">
      <img src="/gula-white.svg" alt="" width={32} height={32} className="size-8 shrink-0 invert dark:invert-0" />
      <span className={cx("text-lg font-semibold tracking-tight whitespace-nowrap", labelClassName)}>GulaTools</span>
    </Link>
  )
}

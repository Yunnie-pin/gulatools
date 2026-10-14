import { backgroundSrcSet, backgroundUrl } from "@/lib/backgrounds"
import { useTheme } from "@/lib/theme"

const ORBITS = [
  { size: 64, seconds: 120, reverse: false, planet: 28 },
  { size: 96, seconds: 180, reverse: true, planet: 16 },
  { size: 132, seconds: 240, reverse: false, planet: 44 },
]

function Orbits() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      {ORBITS.map(({ size, seconds, reverse, planet }) => (
        <div
          key={size}
          className="absolute animate-[orbit_linear_infinite] rounded-full border border-white/55 dark:border-white/20"
          style={{
            width: `${size}vmax`,
            height: `${size}vmax`,
            animationDuration: `${seconds}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/10 dark:border-white/30 dark:bg-white/5"
            style={{ width: planet * 2, height: planet * 2 }}
          />
        </div>
      ))}
    </div>
  )
}

// I have nothing but my burger and I want nothing more
export function Backdrop() {
  const { background } = useTheme()

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-[#0b0b0d]">
      <img
        key={background}
        src={backgroundUrl(background)}
        srcSet={backgroundSrcSet(background)}
        sizes="100vw"
        alt=""
        decoding="async"
        className="size-full animate-[fade-in_.8s_var(--ease)] object-cover"
      />
      <div className="absolute inset-0 bg-white/30 dark:bg-black/55" />
      <Orbits />
    </div>
  )
}

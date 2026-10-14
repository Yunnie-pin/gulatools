import { backgroundSrcSet, backgroundUrl } from "@/lib/backgrounds"
import { useTheme } from "@/lib/theme"

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
    </div>
  )
}

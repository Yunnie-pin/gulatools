import { ExternalLink, X } from "lucide-react"
import { useEffect, useId, useRef } from "react"
import { glassButtonClass } from "@/components/glass/GlassButton"
import { Logo } from "@/components/Logo"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { useLightDismiss } from "@/lib/dialog"

export const REPO_URL = "https://github.com/Yunnie-pin/gulatools"

const OPEN_EVENT = "gulatools:open-about"

export const openAbout = () => window.dispatchEvent(new Event(OPEN_EVENT))

export function AboutDialog() {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const t = useMessages(ui).shell
  const close = () => dialogRef.current?.close()
  const lightDismiss = useLightDismiss()

  useEffect(() => {
    const open = () => dialogRef.current?.showModal()
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...lightDismiss}
      className="glass glass-strong m-auto w-[min(420px,calc(100%-2rem))] rounded-glass p-0 text-ink backdrop:bg-black/30"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <Logo onClick={close} />
          <button type="button" aria-label={t.close} onClick={close} className={glassButtonClass("frost", "w-9 px-0")}>
            <X aria-hidden="true" className="size-[18px]" />
          </button>
        </div>
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {t.aboutTitle}
        </h2>
        <p className="text-sm text-ink-soft">{t.aboutBody}</p>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className={glassButtonClass("key", "self-start")}>
          {t.viewOnGithub}
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>
    </dialog>
  )
}

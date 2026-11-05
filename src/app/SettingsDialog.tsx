import { Download, X } from "lucide-react"
import { type ReactNode, useEffect, useId, useRef } from "react"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassButton, glassButtonClass } from "@/components/glass/GlassButton"
import { Segmented } from "@/components/glass/Segmented"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { cx } from "@/lib/cx"
import { useLightDismiss } from "@/lib/dialog"
import { type EditorSettings, FONT_SIZES, updateEditorSettings, useEditorSettings } from "@/lib/editor-settings"
import { promptInstall, useCanInstall, useInstalled, useOnline } from "@/lib/pwa"
import { SHORTCUTS, type ShortcutId, shortcutLabel } from "@/lib/shortcuts"

const OPEN_EVENT = "gulatools:open-settings"

export const openSettings = () => window.dispatchEvent(new Event(OPEN_EVENT))

const FONT_SIZE_OPTIONS = FONT_SIZES.map((size) => ({ value: size, label: `${size}px` }))

const SHORTCUT_IDS = Object.keys(SHORTCUTS) as ShortcutId[]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

export function SettingsDialog() {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const t = useMessages(ui).shell
  const editor = useEditorSettings()
  const online = useOnline()
  const canInstall = useCanInstall()
  const installed = useInstalled()
  const close = () => dialogRef.current?.close()
  const lightDismiss = useLightDismiss()

  useEffect(() => {
    const open = () => {
      if (!dialogRef.current?.open) dialogRef.current?.showModal()
    }
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...lightDismiss}
      className="glass glass-strong m-auto max-h-[calc(100dvh-2rem)] w-[min(480px,calc(100%-2rem))] overflow-y-auto rounded-glass p-0 text-ink backdrop:bg-black/30"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight">
            {t.settings}
          </h2>
          <button type="button" aria-label={t.close} onClick={close} className={glassButtonClass("frost", "w-9 px-0")}>
            <X aria-hidden="true" className="size-[18px]" />
          </button>
        </div>

        <Section title={t.editor}>
          <Segmented<EditorSettings["fontSize"]>
            label={t.fontSize}
            value={editor.fontSize}
            options={FONT_SIZE_OPTIONS}
            onChange={(fontSize) => updateEditorSettings({ fontSize })}
            className="self-start"
          />
          <Checkbox label={t.wordWrap} checked={editor.wrap} onChange={(wrap) => updateEditorSettings({ wrap })} />
          <Checkbox
            label={t.lineNumbers}
            checked={editor.lineNumbers}
            onChange={(lineNumbers) => updateEditorSettings({ lineNumbers })}
          />
        </Section>

        <Section title={t.shortcuts}>
          <dl className="flex flex-col">
            {SHORTCUT_IDS.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between gap-3 border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/10"
              >
                <dt className="text-ink-soft">{t.shortcutNames[id]}</dt>
                <dd>
                  <kbd className="rounded-[6px] bg-black/5 px-2 py-0.5 font-mono text-xs dark:bg-white/10">
                    {shortcutLabel(id)}
                  </kbd>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t.app}>
          <p className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className={cx("size-2 shrink-0 rounded-full", online ? "bg-success" : "bg-amber-500")}
            />
            {online ? t.online : t.offline}
          </p>
          {installed ? (
            <p className="text-sm text-ink-soft">{t.installed}</p>
          ) : (
            canInstall && (
              <>
                <p className="text-sm text-ink-soft">{t.installHint}</p>
                <GlassButton variant="key" onClick={promptInstall} className="self-start">
                  <Download aria-hidden="true" className="size-4" />
                  {t.install}
                </GlassButton>
              </>
            )
          )}
        </Section>
      </div>
    </dialog>
  )
}

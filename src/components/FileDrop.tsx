import { type DragEvent, type ReactNode, useState } from "react"
import { useMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { cx } from "@/lib/cx"

type FileDropProps = {
  label: string
  onFile: (file: File) => void
  children: ReactNode
  className?: string
}

const hasFiles = (e: DragEvent) => e.dataTransfer.types.includes("Files")

export function FileDrop({ label, onFile, children, className }: FileDropProps) {
  const [over, setOver] = useState(false)
  const t = useMessages(ui).common

  return (
    <section
      aria-label={label}
      className={cx("relative", className)}
      onDragOver={(e) => {
        if (!hasFiles(e)) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false)
      }}
      onDrop={(e) => {
        if (!hasFiles(e)) return
        e.preventDefault()
        setOver(false)
        const file = e.dataTransfer.files[0]
        if (file) onFile(file)
      }}
    >
      {children}
      {over && (
        <div className="pointer-events-none absolute inset-2 z-10 grid place-items-center rounded-glass-md border-2 border-dashed border-focus bg-focus/10 text-sm font-medium">
          {t.dropFile}
        </div>
      )}
    </section>
  )
}

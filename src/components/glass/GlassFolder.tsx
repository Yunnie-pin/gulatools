import { Layers, type LucideIcon } from "lucide-react"
import { type CSSProperties, type RefObject, useEffect, useId, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import { MoreIcon } from "@/components/icons"
import { hashString, rng } from "@/lib/random"
import { GlassMenu } from "./GlassMenu"

export type FolderFile = {
  name: string
  meta?: string
  to: string
  icon?: LucideIcon
}

type GlassFolderProps = {
  label: string
  meta?: string
  files: FolderFile[]
  width?: number
  appearDelay?: number
}

const W = 340
const H = 272
const HEADROOM = 54
const FRONT_H = 198
const FOLDER_CAPACITY = 4

const BACK_PATH =
  "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z"
const FRONT_PATH = `M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ${FRONT_H - 22}A22 22 0 0 1 318 ${FRONT_H}L22 ${FRONT_H}A22 22 0 0 1 0 ${FRONT_H - 22}Z`

const fanSlot = (index: number, count: number) => (count <= 1 ? 0 : (index / (count - 1)) * 2 - 1)
const countLabel = (n: number) => `${n} ${n === 1 ? "tool" : "tools"}`

function useEntrance(delay: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        timer = window.setTimeout(() => setEntered(true), delay)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [delay])

  return { ref, entered }
}

function usePointerParallax(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let px = 0
    let py = 0
    const write = () => {
      raf = 0
      el.style.setProperty("--gf-px", px.toFixed(3))
      el.style.setProperty("--gf-py", py.toFixed(3))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(write)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * 2 - 1
      py = ((e.clientY - r.top) / r.height) * 2 - 1
      schedule()
    }
    const leave = () => {
      px = 0
      py = 0
      schedule()
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      cancelAnimationFrame(raf)
    }
  }, [ref])
}

export function GlassFolder({ label, meta, files, width = W, appearDelay = 0 }: GlassFolderProps) {
  const uid = useId().replace(/:/g, "")
  const { ref: rootRef, entered } = useEntrance(appearDelay)
  const filesRef = useRef<HTMLUListElement>(null)
  const hitRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  usePointerParallax(rootRef)

  const scale = width / W

  useEffect(() => {
    filesRef.current?.toggleAttribute("inert", !open)
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      setOpen(false)
      hitRef.current?.focus()
    }
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open, rootRef])

  const overflowing = files.length > FOLDER_CAPACITY
  const visible = overflowing ? files.slice(0, FOLDER_CAPACITY - 1) : files
  const hidden = overflowing ? files.slice(FOLDER_CAPACITY - 1) : []
  const sheetCount = visible.length + (hidden.length ? 1 : 0)
  const metaLine = meta ?? countLabel(files.length)

  const sheetStyle = (index: number, seed: string) => {
    const jitter = rng(hashString(seed))
    return {
      "--gf-slot": fanSlot(index, sheetCount),
      "--gf-depth": index,
      "--gf-jx": `${((jitter() - 0.5) * 10).toFixed(2)}px`,
      "--gf-jr": `${((jitter() - 0.5) * 3.2).toFixed(2)}deg`,
      zIndex: sheetCount - index,
    } as CSSProperties
  }

  return (
    <div
      ref={rootRef}
      className="gf-root"
      data-open={open || undefined}
      data-entered={entered || undefined}
      style={{ width, height: (H + HEADROOM) * scale }}
    >
      <div className="gf-stage" style={{ transform: `translateY(${HEADROOM * scale}px) scale(${scale})` }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          <div className="gf-back" style={{ clipPath: `path('${BACK_PATH}')` }} aria-hidden="true">
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          <div className="gf-front" style={{ clipPath: `path('${FRONT_PATH}')` }}>
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={`0 0 ${W} ${FRONT_H}`} aria-hidden="true">
              <defs>
                <linearGradient id={`gf-rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={`url(#gf-rim-${uid})`} />
            </svg>
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-expanded={open}
              aria-label={`${open ? "Tutup" : "Buka"} ${label}, ${countLabel(files.length)}`}
              onClick={() => setOpen(!open)}
            />
            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta">{metaLine}</span>
            </div>
          </div>

          <ul ref={filesRef} className="gf-files" aria-label={`Isi ${label}`}>
            {visible.map((file, i) => (
              <li key={file.to} className="gf-sheet-slot">
                <Link to={file.to} className="gf-sheet" style={sheetStyle(i, file.name)}>
                  <span className="gf-lines" aria-hidden="true">
                    <i style={{ width: "86%" }} />
                    <i style={{ width: "92%" }} />
                    <i style={{ width: "64%" }} />
                    <i style={{ width: "88%" }} />
                    <i style={{ width: "42%" }} />
                  </span>
                  <span className="gf-sheet-head">
                    <span className="gf-sheet-name">
                      {file.icon && <file.icon aria-hidden="true" className="gf-sheet-icon" />}
                      {file.name}
                    </span>
                    {file.meta && <span className="gf-sheet-meta">{file.meta}</span>}
                  </span>
                </Link>
              </li>
            ))}
            {hidden.length > 0 && (
              <li className="gf-sheet-slot">
                <button
                  type="button"
                  className="gf-sheet gf-sheet--more"
                  style={sheetStyle(visible.length, `${label}-more`)}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen(true)}
                >
                  <span className="gf-more-names" aria-hidden="true">
                    {hidden.map((file) => (
                      <span key={file.to}>{file.name}</span>
                    ))}
                  </span>
                  <span className="gf-sheet-head">
                    <span className="gf-sheet-name">
                      <Layers aria-hidden="true" className="gf-sheet-icon" />+{hidden.length} lainnya
                    </span>
                    <span className="gf-sheet-meta">Lihat semua</span>
                  </span>
                </button>
              </li>
            )}
          </ul>

          {hidden.length > 0 && (
            <GlassMenu
              label={`Tool lain di ${label}`}
              items={hidden.map((file) => ({ label: file.name, onSelect: () => navigate(file.to) }))}
              trigger={<MoreIcon className="gf-glyph" />}
              triggerClassName="gf-key"
              className="right-[22px] bottom-[90px] origin-bottom-right"
              open={menuOpen}
              onOpenChange={setMenuOpen}
            />
          )}
        </div>
      </div>
    </div>
  )
}

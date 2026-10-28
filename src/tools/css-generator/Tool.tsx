import { Plus, Trash2 } from "lucide-react"
import type { ReactNode } from "react"
import { CopyButton } from "@/components/CopyButton"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { Pane } from "@/components/Pane"
import { RangeField } from "@/components/RangeField"
import { useMessages } from "@/i18n/locale"
import { cx } from "@/lib/cx"
import { labeled } from "@/lib/options"
import { oneOf, usePersistentState } from "@/lib/persist"
import {
  type Declaration,
  type GlassConfig,
  type GradientConfig,
  glassCss,
  gradientCss,
  type ShadowLayer,
  shadowCss,
  toCssText,
  toStyle,
} from "./logic"
import { messages } from "./messages"

type Mode = "gradient" | "shadow" | "glass"

const MODES = ["gradient", "shadow", "glass"] as const satisfies readonly Mode[]

const GRADIENT_TYPES = ["linear", "radial"] as const satisfies readonly GradientConfig["type"][]

const MAX_ITEMS = 5

const DEFAULT_GRADIENT: GradientConfig = {
  type: "linear",
  angle: 135,
  stops: [
    { color: "#ff6b5e", position: 0 },
    { color: "#7c5cff", position: 100 },
  ],
}

const DEFAULT_LAYER: ShadowLayer = { x: 0, y: 12, blur: 32, spread: -8, color: "#000000", opacity: 0.3, inset: false }

const DEFAULT_GLASS: GlassConfig = {
  tint: "#ffffff",
  opacity: 0.18,
  blur: 16,
  saturation: 180,
  borderOpacity: 0.35,
  radius: 24,
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null
const isGradient = (value: unknown) => isObject(value) && Array.isArray(value.stops) && value.stops.length >= 2
const isLayers = (value: unknown) => Array.isArray(value) && value.every(isObject)
const isGlass = (value: unknown) => isObject(value) && typeof value.tint === "string"

export default function CssGenerator() {
  const t = useMessages(messages)
  const [mode, setMode] = usePersistentState<Mode>("mode", "gradient", oneOf(MODES))
  const [gradient, setGradient] = usePersistentState<GradientConfig>("gradient", DEFAULT_GRADIENT, isGradient)
  const [layers, setLayers] = usePersistentState<ShadowLayer[]>("shadow", [DEFAULT_LAYER], isLayers)
  const [glass, setGlass] = usePersistentState<GlassConfig>("glass", DEFAULT_GLASS, isGlass)

  const declarations: Declaration[] =
    mode === "gradient" ? gradientCss(gradient) : mode === "shadow" ? shadowCss(layers) : glassCss(glass)
  const css = toCssText(declarations)

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<Mode> label="Mode" value={mode} options={labeled(MODES, t.modes)} onChange={setMode} />
      </GlassPanel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
          {mode === "gradient" && <GradientEditor value={gradient} onChange={setGradient} />}
          {mode === "shadow" && <ShadowEditor value={layers} onChange={setLayers} />}
          {mode === "glass" && <GlassEditor value={glass} onChange={setGlass} />}
        </GlassPanel>

        <div className="flex flex-col gap-4">
          <Preview mode={mode} declarations={declarations} label={t.preview} />
          <Pane title="CSS" action={<CopyButton text={css} />}>
            <pre className="p-4 font-mono text-sm break-all whitespace-pre-wrap">{css}</pre>
          </Pane>
        </div>
      </div>
    </div>
  )
}

function Preview({ mode, declarations, label }: { mode: Mode; declarations: Declaration[]; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cx(
        "relative grid h-64 place-items-center overflow-hidden rounded-glass",
        mode === "glass"
          ? "bg-[radial-gradient(circle_at_25%_30%,#ff6b5e_0_22%,transparent_23%),radial-gradient(circle_at_75%_70%,#7c5cff_0_26%,transparent_27%),linear-gradient(135deg,#0ea5e9,#22c55e)]"
          : "bg-zinc-100",
      )}
    >
      <div
        style={toStyle(declarations)}
        className={cx(
          "size-40",
          mode === "shadow" && "rounded-glass bg-white",
          mode === "gradient" && "rounded-glass",
        )}
      />
    </div>
  )
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="color"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-12 shrink-0 cursor-pointer rounded-glass-sm bg-transparent"
    />
  )
}

function ItemRow({
  children,
  onRemove,
  removeLabel,
}: {
  children: ReactNode
  onRemove?: () => void
  removeLabel: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-glass-sm border border-black/5 p-3 dark:border-white/10">
      {children}
      {onRemove && (
        <GlassButton onClick={onRemove} className="self-start">
          <Trash2 aria-hidden="true" className="size-4" />
          {removeLabel}
        </GlassButton>
      )}
    </div>
  )
}

function GradientEditor({ value, onChange }: { value: GradientConfig; onChange: (value: GradientConfig) => void }) {
  const t = useMessages(messages)
  const setStop = (index: number, patch: Partial<GradientConfig["stops"][number]>) =>
    onChange({ ...value, stops: value.stops.map((stop, i) => (i === index ? { ...stop, ...patch } : stop)) })

  return (
    <>
      <Segmented<GradientConfig["type"]>
        label={t.gradientType}
        value={value.type}
        options={labeled(GRADIENT_TYPES, t.gradientTypes)}
        onChange={(type) => onChange({ ...value, type })}
      />
      {value.type === "linear" && (
        <RangeField
          label={t.angle}
          value={value.angle}
          min={0}
          max={360}
          format={(angle) => `${angle}°`}
          onChange={(angle) => onChange({ ...value, angle })}
        />
      )}
      {value.stops.map((stop, index) => (
        <ItemRow
          // biome-ignore lint/suspicious/noArrayIndexKey: stops have no identity besides their position in the list
          key={index}
          removeLabel={t.removeStop(index + 1)}
          onRemove={
            value.stops.length > 2
              ? () => onChange({ ...value, stops: value.stops.filter((_, i) => i !== index) })
              : undefined
          }
        >
          <div className="flex items-end gap-3">
            <ColorInput
              label={t.stopColor(index + 1)}
              value={stop.color}
              onChange={(color) => setStop(index, { color })}
            />
            <div className="flex-1">
              <RangeField
                label={t.stopPosition(index + 1)}
                value={stop.position}
                min={0}
                max={100}
                format={(position) => `${position}%`}
                onChange={(position) => setStop(index, { position })}
              />
            </div>
          </div>
        </ItemRow>
      ))}
      <GlassButton
        disabled={value.stops.length >= MAX_ITEMS}
        onClick={() => onChange({ ...value, stops: [...value.stops, { color: "#ffd166", position: 50 }] })}
        className="self-start"
      >
        <Plus aria-hidden="true" className="size-4" />
        {t.addStop}
      </GlassButton>
    </>
  )
}

function ShadowEditor({ value, onChange }: { value: ShadowLayer[]; onChange: (value: ShadowLayer[]) => void }) {
  const t = useMessages(messages)
  const setLayer = (index: number, patch: Partial<ShadowLayer>) =>
    onChange(value.map((layer, i) => (i === index ? { ...layer, ...patch } : layer)))
  const px = (n: number) => `${n}px`

  return (
    <>
      {value.map((layer, index) => (
        <ItemRow
          // biome-ignore lint/suspicious/noArrayIndexKey: layers have no identity besides their position in the list
          key={index}
          removeLabel={t.removeLayer(index + 1)}
          onRemove={() => onChange(value.filter((_, i) => i !== index))}
        >
          <div className="flex items-center gap-3">
            <ColorInput
              label={t.layerColor(index + 1)}
              value={layer.color}
              onChange={(color) => setLayer(index, { color })}
            />
            <Checkbox label="Inset" checked={layer.inset} onChange={(inset) => setLayer(index, { inset })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <RangeField
              label="X"
              value={layer.x}
              min={-50}
              max={50}
              format={px}
              onChange={(x) => setLayer(index, { x })}
            />
            <RangeField
              label="Y"
              value={layer.y}
              min={-50}
              max={50}
              format={px}
              onChange={(y) => setLayer(index, { y })}
            />
            <RangeField
              label="Blur"
              value={layer.blur}
              min={0}
              max={100}
              format={px}
              onChange={(blur) => setLayer(index, { blur })}
            />
            <RangeField
              label="Spread"
              value={layer.spread}
              min={-50}
              max={50}
              format={px}
              onChange={(spread) => setLayer(index, { spread })}
            />
            <RangeField
              label={t.opacity}
              value={layer.opacity}
              min={0}
              max={1}
              step={0.01}
              format={(opacity) => `${Math.round(opacity * 100)}%`}
              onChange={(opacity) => setLayer(index, { opacity })}
            />
          </div>
        </ItemRow>
      ))}
      <GlassButton
        disabled={value.length >= MAX_ITEMS}
        onClick={() => onChange([...value, DEFAULT_LAYER])}
        className="self-start"
      >
        <Plus aria-hidden="true" className="size-4" />
        {t.addLayer}
      </GlassButton>
    </>
  )
}

function GlassEditor({ value, onChange }: { value: GlassConfig; onChange: (value: GlassConfig) => void }) {
  const t = useMessages(messages)
  const set = (patch: Partial<GlassConfig>) => onChange({ ...value, ...patch })
  const percent = (n: number) => `${Math.round(n * 100)}%`

  return (
    <>
      <div className="flex items-center gap-3">
        <ColorInput label={t.tint} value={value.tint} onChange={(tint) => set({ tint })} />
        <span className="text-sm text-ink-soft">{t.tint}</span>
      </div>
      <RangeField
        label={t.opacity}
        value={value.opacity}
        min={0}
        max={1}
        step={0.01}
        format={percent}
        onChange={(opacity) => set({ opacity })}
      />
      <RangeField
        label="Blur"
        value={value.blur}
        min={0}
        max={40}
        format={(n) => `${n}px`}
        onChange={(blur) => set({ blur })}
      />
      <RangeField
        label={t.saturation}
        value={value.saturation}
        min={100}
        max={250}
        format={(n) => `${n}%`}
        onChange={(saturation) => set({ saturation })}
      />
      <RangeField
        label={t.border}
        value={value.borderOpacity}
        min={0}
        max={1}
        step={0.01}
        format={percent}
        onChange={(borderOpacity) => set({ borderOpacity })}
      />
      <RangeField
        label={t.radius}
        value={value.radius}
        min={0}
        max={48}
        format={(n) => `${n}px`}
        onChange={(radius) => set({ radius })}
      />
    </>
  )
}

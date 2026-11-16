import { Download } from "lucide-react"
import { useMemo, useState } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassInput } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { useMessages } from "@/i18n/locale"
import { downloadText, downloadUrl } from "@/lib/file"
import { oneOf, usePersistentState } from "@/lib/persist"
import { qrMatrix } from "@/lib/qr"
import { attempt } from "@/lib/result"
import { WIFI_SECURITY, type WifiSecurity, wifiPayload, wifiPng, wifiSvg } from "./logic"
import { messages } from "./messages"

export default function WifiQrTool() {
  const t = useMessages(messages)
  const [ssid, setSsid] = usePersistentState("ssid", "")
  const [security, setSecurity] = usePersistentState<WifiSecurity>("security", "WPA", oneOf(WIFI_SECURITY))
  const [hidden, setHidden] = usePersistentState("hidden", false)
  const [password, setPassword] = useState("")

  const payload = useMemo(
    () => attempt(() => wifiPayload({ ssid, password, security, hidden })),
    [ssid, password, security, hidden],
  )
  const matrix = useMemo(() => (payload.ok ? qrMatrix(payload.value, "M") : null), [payload])
  const fileName = `wifi-${ssid.replace(/[^\w-]+/g, "_")}`

  const fill = (nextSsid: string, nextPassword: string) => {
    setSsid(nextSsid)
    setPassword(nextPassword)
  }

  const sample = () => {
    fill("Kopi Gula", "rahasia123")
    setSecurity("WPA")
    setHidden(false)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <Field label={t.ssid}>
          {(id) => (
            <GlassInput
              id={id}
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">{t.security}</span>
          <Segmented<WifiSecurity>
            label={t.security}
            value={security}
            options={WIFI_SECURITY.map((value) => ({ value, label: t.securities[value] }))}
            onChange={setSecurity}
            className="w-fit"
          />
        </div>
        {security !== "nopass" && (
          <Field label={t.password}>
            {(id) => (
              <GlassInput
                id={id}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
              />
            )}
          </Field>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Checkbox label={t.hidden} checked={hidden} onChange={setHidden} />
          <div className="ml-auto flex gap-2">
            <SampleButton onClick={sample} />
            <ClearButton onClick={() => fill("", "")} disabled={!ssid && !password} />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel variant="solid" className="flex flex-col items-center gap-4 p-5 text-center">
        {payload.ok && matrix ? (
          <>
            <svg
              role="img"
              aria-label={t.qrFor(ssid)}
              viewBox={`-2 -2 ${matrix.size + 4} ${matrix.size + 4}`}
              shapeRendering="crispEdges"
              className="aspect-square w-full max-w-72 rounded-glass-sm bg-white"
            >
              <path d={matrix.path} fill="#000" />
            </svg>
            <p className="text-sm text-ink-soft">{t.scanHint}</p>
            <div className="flex gap-2">
              <GlassButton onClick={async () => downloadUrl(await wifiPng(payload.value), `${fileName}.png`)}>
                <Download aria-hidden="true" className="size-4" />
                PNG
              </GlassButton>
              <GlassButton
                onClick={async () => downloadText(await wifiSvg(payload.value), `${fileName}.svg`, "image/svg+xml")}
              >
                <Download aria-hidden="true" className="size-4" />
                SVG
              </GlassButton>
            </div>
          </>
        ) : (
          !payload.ok && <ErrorText className="my-auto">{payload.error}</ErrorText>
        )}
      </GlassPanel>
    </div>
  )
}

import QRCode from "qrcode"
import { LocalizedError } from "@/i18n/errors"

export const WIFI_SECURITY = ["WPA", "WEP", "nopass"] as const

export type WifiSecurity = (typeof WIFI_SECURITY)[number]

export type WifiConfig = { ssid: string; password: string; security: WifiSecurity; hidden: boolean }

const escapeField = (text: string) => text.replace(/[\\;,:"]/g, "\\$&")

export function wifiPayload({ ssid, password, security, hidden }: WifiConfig): string {
  if (!ssid) throw new LocalizedError("emptySsid")
  if (security === "WPA" && (password.length < 8 || password.length > 63)) {
    throw new LocalizedError("wpaPasswordLength")
  }
  const fields = [`T:${security}`, `S:${escapeField(ssid)}`]
  if (security !== "nopass") fields.push(`P:${escapeField(password)}`)
  if (hidden) fields.push("H:true")
  return `WIFI:${fields.join(";")};;`
}

const options = { errorCorrectionLevel: "M", margin: 2 } as const

export const wifiPng = (payload: string) => QRCode.toDataURL(payload, { ...options, width: 1024 })

export const wifiSvg = (payload: string) => QRCode.toString(payload, { ...options, type: "svg" })

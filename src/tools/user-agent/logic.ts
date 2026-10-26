import { UAParser } from "ua-parser-js"

export type UserAgentInfo = {
  browser: string
  engine: string
  os: string
  device: string
  deviceType: string
  cpu: string
}

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ")

export function parseUserAgent(userAgent: string): UserAgentInfo {
  const { browser, engine, os, device, cpu } = new UAParser(userAgent.trim()).getResult()
  return {
    browser: join(browser.name, browser.version),
    engine: join(engine.name, engine.version),
    os: join(os.name, os.version),
    device: join(device.vendor, device.model),
    deviceType: device.type ?? "desktop",
    cpu: cpu.architecture ?? "",
  }
}

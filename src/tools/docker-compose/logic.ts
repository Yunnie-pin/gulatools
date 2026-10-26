import { stringify } from "yaml"
import { LocalizedError } from "@/i18n/errors"
import { tokenize } from "@/lib/shell"

type Service = Record<string, unknown>

const SHORT_VALUE: Record<string, string> = {
  p: "--publish",
  v: "--volume",
  e: "--env",
  w: "--workdir",
  u: "--user",
  h: "--hostname",
  l: "--label",
  m: "--memory",
}

const SHORT_SWITCH: Record<string, string> = {
  d: "--detach",
  i: "--interactive",
  t: "--tty",
  P: "--publish-all",
}

const SWITCHES: Record<string, [key: string, value: unknown] | null> = {
  "--detach": null,
  "--rm": null,
  "--interactive": ["stdin_open", true],
  "--tty": ["tty", true],
  "--privileged": ["privileged", true],
  "--init": ["init", true],
  "--read-only": ["read_only", true],
}

const SCALARS: Record<string, string> = {
  "--name": "container_name",
  "--restart": "restart",
  "--workdir": "working_dir",
  "--user": "user",
  "--hostname": "hostname",
  "--memory": "mem_limit",
  "--cpus": "cpus",
  "--shm-size": "shm_size",
  "--platform": "platform",
  "--pull": "pull_policy",
  "--stop-signal": "stop_signal",
  "--pid": "pid",
  "--ipc": "ipc",
}

const LISTS: Record<string, string> = {
  "--publish": "ports",
  "--volume": "volumes",
  "--env": "environment",
  "--env-file": "env_file",
  "--label": "labels",
  "--cap-add": "cap_add",
  "--cap-drop": "cap_drop",
  "--add-host": "extra_hosts",
  "--dns": "dns",
  "--device": "devices",
  "--tmpfs": "tmpfs",
  "--expose": "expose",
  "--security-opt": "security_opt",
  "--sysctl": "sysctls",
}

const HEALTH: Record<string, string> = {
  "--health-cmd": "test",
  "--health-interval": "interval",
  "--health-timeout": "timeout",
  "--health-retries": "retries",
  "--health-start-period": "start_period",
}

const BUILTIN_NETWORKS = new Set(["host", "bridge", "none"])

const ALIASES: Record<string, string> = { "--net": "--network" }

const takesValue = (flag: string) =>
  flag in SCALARS ||
  flag in LISTS ||
  flag in HEALTH ||
  ["--network", "--entrypoint", "--log-driver", "--log-opt", "--mount", "--gpus", "--ulimit"].includes(flag)

export type ComposeResult = { yaml: string; ignored: string[] }

function serviceName(image: string) {
  const base = image.split("/").pop()?.split(/[:@]/)[0] ?? "app"
  return base.replace(/[^a-z0-9_-]/gi, "-").toLowerCase() || "app"
}

const push = (service: Service, key: string, value: unknown) => {
  const list = (service[key] as unknown[] | undefined) ?? []
  service[key] = [...list, value]
}

function parseRun(tokens: string[], ignored: Set<string>, networks: Set<string>): [name: string, Service] {
  const start = tokens[1] === "container" ? 3 : 2
  if (tokens[0] !== "docker" || tokens[start - 1] !== "run") throw new LocalizedError("notDockerRun")

  const service: Service = {}
  const health: Record<string, unknown> = {}
  const logging: { driver?: string; options?: Record<string, string> } = {}
  let i = start

  const next = (flag: string) => {
    if (i + 1 >= tokens.length) throw new LocalizedError("missingFlagValue", flag)
    return tokens[++i]!
  }

  const apply = (flag: string, value?: string) => {
    if (flag in SWITCHES) {
      const entry = SWITCHES[flag]
      if (entry) service[entry[0]] = entry[1]
    } else if (value === undefined) ignored.add(flag)
    else if (flag in SCALARS) service[SCALARS[flag]!] = value
    else if (flag in LISTS) push(service, LISTS[flag]!, value)
    else if (flag in HEALTH) health[HEALTH[flag]!] = flag === "--health-cmd" ? ["CMD-SHELL", value] : value
    else if (flag === "--entrypoint") service.entrypoint = value
    else if (flag === "--log-driver") logging.driver = value
    else if (flag === "--log-opt") {
      const [key = "", ...rest] = value.split("=")
      logging.options = { ...logging.options, [key]: rest.join("=") }
    } else if (flag === "--network") {
      if (BUILTIN_NETWORKS.has(value)) service.network_mode = value
      else {
        push(service, "networks", value)
        networks.add(value)
      }
    } else ignored.add(flag)
  }

  for (; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token === "--") {
      i++
      break
    }
    if (token.startsWith("--")) {
      const eq = token.indexOf("=")
      const raw = eq > 0 ? token.slice(0, eq) : token
      const flag = ALIASES[raw] ?? raw
      apply(flag, eq > 0 ? token.slice(eq + 1) : takesValue(flag) ? next(flag) : undefined)
    } else if (token.startsWith("-") && token.length > 1) {
      for (let j = 1; j < token.length; j++) {
        const char = token[j]!
        if (SHORT_SWITCH[char]) apply(SHORT_SWITCH[char]!)
        else if (SHORT_VALUE[char]) {
          const flag = SHORT_VALUE[char]!
          apply(flag, token.slice(j + 1) || next(flag))
          break
        } else ignored.add(`-${char}`)
      }
    } else break
  }

  const image = tokens[i]
  if (!image) throw new LocalizedError("dockerNoImage")
  const command = tokens.slice(i + 1)

  const ordered: Service = { image, ...service }
  if (command.length) ordered.command = command
  if (Object.keys(health).length) ordered.healthcheck = health
  if (logging.driver || logging.options) ordered.logging = logging
  return [(service.container_name as string | undefined) ?? serviceName(image), ordered]
}

export function dockerRunToCompose(input: string): ComposeResult {
  const commands = input
    .replace(/\\\r?\n/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
  if (!commands.length) throw new LocalizedError("notDockerRun")

  const ignored = new Set<string>()
  const networks = new Set<string>()
  const services: Record<string, Service> = {}
  for (const command of commands) {
    const [name, service] = parseRun(tokenize(command), ignored, networks)
    let unique = name
    for (let n = 2; unique in services; n++) unique = `${name}-${n}`
    services[unique] = service
  }

  const compose: Record<string, unknown> = { services }
  if (networks.size) compose.networks = Object.fromEntries([...networks].map((name) => [name, { external: true }]))
  return { yaml: stringify(compose), ignored: [...ignored] }
}

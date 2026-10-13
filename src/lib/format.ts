const UNITS = ["B", "KB", "MB", "GB", "TB"]

export function formatBytes(bytes: number): string {
  const exponent = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)), UNITS.length - 1)
  const value = bytes / 1024 ** exponent
  return `${exponent ? value.toFixed(1) : value} ${UNITS[exponent]}`
}

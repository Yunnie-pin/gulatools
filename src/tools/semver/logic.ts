import semver from "semver"
import { LocalizedError } from "@/i18n/errors"

export type VersionCheck = { version: string; valid: boolean; satisfies: boolean }

export type RangeReport = {
  normalized: string
  min: string | null
  best: string | null
  checks: VersionCheck[]
}

export function checkRange(range: string, versions: string, includePrerelease: boolean): RangeReport {
  const options = { includePrerelease }
  const normalized = semver.validRange(range.trim() || "*", options)
  if (normalized === null) throw new LocalizedError("invalidSemverRange")

  const checks = versions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((version) => {
      const valid = semver.valid(version) !== null
      return { version, valid, satisfies: valid && semver.satisfies(version, normalized, options) }
    })

  return {
    normalized,
    min: semver.minVersion(normalized)?.version ?? null,
    best: semver.maxSatisfying(
      checks.filter((check) => check.valid).map((check) => check.version),
      normalized,
      options,
    ),
    checks,
  }
}

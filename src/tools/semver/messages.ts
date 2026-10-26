import { defineMessages } from "@/i18n/locale"

export const messages = defineMessages(
  {
    range: "Range",
    versions: "Versi (satu per baris)",
    includePrerelease: "Sertakan prerelease (1.0.0-beta)",
    normalized: "Range lengkap",
    min: "Versi minimum",
    best: "Versi tertinggi yang cocok",
    satisfies: "Cocok",
    notSatisfies: "Tidak cocok",
    invalid: "Bukan semver",
  },
  {
    range: "Range",
    versions: "Versions (one per line)",
    includePrerelease: "Include prereleases (1.0.0-beta)",
    normalized: "Expanded range",
    min: "Minimum version",
    best: "Highest matching version",
    satisfies: "Satisfies",
    notSatisfies: "Does not satisfy",
    invalid: "Not semver",
  },
)

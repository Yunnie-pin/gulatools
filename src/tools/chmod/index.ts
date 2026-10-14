import { FileLock } from "lucide-react"
import { lazy } from "react"
import type { Tool } from "@/lib/tool"

export const chmod: Tool = {
  id: "chmod",
  name: "Chmod Calculator",
  short: { id: "Oktal · Simbolik", en: "Octal · Symbolic" },
  description: {
    id: "Hitung izin file Unix dalam bentuk oktal dan simbolik, termasuk setuid, setgid, dan sticky bit.",
    en: "Work out Unix file permissions in octal and symbolic form, including setuid, setgid, and the sticky bit.",
  },
  category: "converter",
  keywords: ["chmod", "permission", "unix", "linux", "octal", "rwx", "setuid", "sticky", "izin", "file"],
  icon: FileLock,
  Component: lazy(() => import("./Tool")),
}

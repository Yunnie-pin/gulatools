import { extendTailwindMerge } from "tailwind-merge"

const merge = extendTailwindMerge({
  extend: {
    theme: {
      color: ["ink", "ink-soft", "glass", "glass-solid", "glass-hover", "danger", "success", "focus"],
      radius: ["glass", "glass-md", "glass-sm"],
      ease: ["glass", "spring"],
    },
  },
})

export const cx = (...classes: (string | false | null | undefined)[]) => merge(classes.filter(Boolean).join(" "))

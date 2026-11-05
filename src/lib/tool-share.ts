import { useEffect, useState } from "react"
import { currentMessages } from "@/i18n/locale"
import { ui } from "@/i18n/ui"
import { readToolState, writeToolState } from "./persist"
import { errorMessage } from "./result"
import { buildStateShareUrl, decodeSharedState, sharedStateFromHash, stateFromQuery } from "./share"
import { toast } from "./toast"
import type { Tool } from "./tool"

const hasIncomingState = () => Boolean(window.location.search || sharedStateFromHash(window.location.hash))

/** Applies `?option=value` deep links and `#t=` share links before the tool mounts; returns false until done. */
export function useIncomingToolState(toolId: string) {
  const [ready, setReady] = useState(() => !hasIncomingState())

  useEffect(() => {
    const { pathname, search, hash } = window.location
    const encoded = sharedStateFromHash(hash)
    if (!search && !encoded) return
    let live = true
    const apply = async () => {
      if (search) writeToolState(toolId, stateFromQuery(search))
      if (encoded) {
        try {
          writeToolState(toolId, await decodeSharedState(encoded))
          toast(currentMessages(ui).tool.stateLoaded)
        } catch (error) {
          toast(errorMessage(error), "error")
        }
      }
      history.replaceState(null, "", `${pathname}${encoded ? "" : hash}`)
      if (live) setReady(true)
    }
    apply()
    return () => {
      live = false
    }
  }, [toolId])

  return ready
}

/** Sensitive tools share their options but never their main input, which may hold tokens or keys. */
export async function copyToolShareLink(tool: Tool) {
  const state = readToolState(tool.id)
  if (tool.sensitive) delete state.input
  try {
    await navigator.clipboard.writeText(await buildStateShareUrl(state, window.location))
    toast(currentMessages(ui).transform.shareCopied)
  } catch (error) {
    toast(errorMessage(error), "error")
  }
}

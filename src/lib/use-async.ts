import { useState } from "react"
import { errorMessage, type Result } from "./result"

type AsyncState<T> = { pending: boolean; result: Result<T> | null }

export function useAsync<Args extends unknown[], T>(fn: (...args: Args) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ pending: false, result: null })

  const run = async (...args: Args) => {
    setState((s) => ({ ...s, pending: true }))
    try {
      setState({ pending: false, result: { ok: true, value: await fn(...args) } })
    } catch (error) {
      setState({ pending: false, result: { ok: false, error: errorMessage(error) } })
    }
  }

  const reset = () => setState({ pending: false, result: null })

  return { ...state, run, reset }
}

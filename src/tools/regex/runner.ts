import { LocalizedError } from "@/i18n/errors"
import { errorMessage, type Result } from "@/lib/result"
import type { RegexInput, RegexResult } from "./logic"

const TIMEOUT_MS = 1000

export function runInWorker(input: RegexInput) {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
  let timer = 0

  const result = new Promise<Result<RegexResult>>((resolve) => {
    timer = window.setTimeout(() => {
      worker.terminate()
      resolve({
        ok: false,
        error: errorMessage(new LocalizedError("regexTimeout")),
      })
    }, TIMEOUT_MS)
    worker.onmessage = (event: MessageEvent<Result<RegexResult>>) => {
      window.clearTimeout(timer)
      worker.terminate()
      resolve(event.data)
    }
    worker.postMessage(input)
  })

  const cancel = () => {
    window.clearTimeout(timer)
    worker.terminate()
  }

  return { result, cancel }
}

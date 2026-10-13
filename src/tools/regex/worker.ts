import { attempt } from "@/lib/result"
import { type RegexInput, runRegex } from "./logic"

self.onmessage = (event: MessageEvent<RegexInput>) => {
  self.postMessage(attempt(() => runRegex(event.data)))
}

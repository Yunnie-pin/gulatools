import { useEffect, useState } from "react"

const FALLBACK_MS = 1500

const hasPainted = () => performance.getEntriesByName("first-contentful-paint").length > 0

export function useAfterFirstPaint() {
  const [painted, setPainted] = useState(hasPainted)

  useEffect(() => {
    if (painted) return
    const done = () => setPainted(true)
    const observer = new PerformanceObserver(() => {
      if (hasPainted()) done()
    })
    observer.observe({ type: "paint", buffered: true })
    const timer = window.setTimeout(done, FALLBACK_MS)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [painted])

  return painted
}

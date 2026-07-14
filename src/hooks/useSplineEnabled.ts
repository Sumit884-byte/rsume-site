import { useEffect, useState } from "react"

export function useSplineEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    const narrow = window.matchMedia("(max-width: 767px)").matches
    setEnabled(!reducedMotion && !coarsePointer && !narrow)
  }, [])

  return enabled
}

import { useEffect, useRef, useState } from "react"

const LERP = 0.18
const RING_LERP = 0.1

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const trailPos = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const [active, setActive] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    if (reducedMotion || coarsePointer) return

    setActive(true)
    document.documentElement.classList.add("custom-cursor-active")

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, label")
      setHovering(!!interactive)
    }

    const animate = () => {
      ringPos.current = {
        x: lerp(ringPos.current.x, pos.current.x, RING_LERP),
        y: lerp(ringPos.current.y, pos.current.y, RING_LERP),
      }
      trailPos.current = {
        x: lerp(trailPos.current.x, pos.current.x, LERP),
        y: lerp(trailPos.current.y, pos.current.y, LERP),
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`
      }

      frame.current = requestAnimationFrame(animate)
    }

    frame.current = requestAnimationFrame(animate)
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseenter", onEnter)
    document.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(frame.current)
      document.documentElement.classList.remove("custom-cursor-active")
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseenter", onEnter)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [visible])

  if (!active) return null

  return (
    <div
      className={`arka-cursor${visible ? " arka-cursor--visible" : ""}${hovering ? " arka-cursor--hover" : ""}`}
      aria-hidden="true"
    >
      <div ref={trailRef} className="arka-cursor__trail" />
      <div ref={ringRef} className="arka-cursor__ring" />
      <div ref={dotRef} className="arka-cursor__dot">
        <span className="arka-cursor__spark" />
      </div>
    </div>
  )
}

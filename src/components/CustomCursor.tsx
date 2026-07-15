import { useEffect, useRef, useState } from "react"

const LERP = 0.22

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

export default function CustomCursor() {
  const pointerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const smoothPos = useRef({ x: 0, y: 0 })
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
      setVisible(true)
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
      smoothPos.current = {
        x: lerp(smoothPos.current.x, pos.current.x, LERP),
        y: lerp(smoothPos.current.y, pos.current.y, LERP),
      }

      const transform = `translate3d(${smoothPos.current.x}px, ${smoothPos.current.y}px, 0)`

      if (pointerRef.current) {
        pointerRef.current.style.transform = transform
      }
      if (glowRef.current) {
        glowRef.current.style.transform = transform
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
  }, [])

  if (!active) return null

  return (
    <div
      className={`arka-cursor${visible ? " arka-cursor--visible" : ""}${hovering ? " arka-cursor--hover" : ""}`}
      aria-hidden="true"
    >
      <div ref={glowRef} className="arka-cursor__glow" />
      <div ref={pointerRef} className="arka-cursor__pointer">
        <img src="/images/cursor-arrow-3d.png" alt="" draggable={false} />
      </div>
    </div>
  )
}

import { lazy, Suspense, useState } from "react"
import { useSplineEnabled } from "../hooks/useSplineEnabled"

const Spline = lazy(() => import("@splinetool/react-spline"))

export default function SplineStar({
  scene,
  variant = "blue",
}: {
  scene: string
  variant?: "blue" | "green"
}) {
  const enabled = useSplineEnabled()
  const [loaded, setLoaded] = useState(false)

  if (!enabled || !scene) {
    return <div className={`decor-star${variant === "green" ? " decor-star-green" : ""}`} />
  }

  return (
    <div className={`spline-star spline-star--${variant}`} aria-hidden="true">
      {!loaded && <div className={`decor-star spline-star__placeholder${variant === "green" ? " decor-star-green" : ""}`} />}
      <Suspense fallback={null}>
        <Spline
          scene={scene}
          renderOnDemand
          onLoad={() => setLoaded(true)}
          className={loaded ? "spline-star__canvas is-loaded" : "spline-star__canvas"}
        />
      </Suspense>
    </div>
  )
}

import { lazy, Suspense, useState } from "react"
import { splineScenes } from "../config/spline"
import { useSplineEnabled } from "../hooks/useSplineEnabled"

const Spline = lazy(() => import("@splinetool/react-spline"))

export default function SplineFloatLayer() {
  const enabled = useSplineEnabled()
  const scene = splineScenes.float
  const [loaded, setLoaded] = useState(false)

  if (!enabled || !scene) return null

  return (
    <div className="spline-float-layer" aria-hidden="true">
      <Suspense fallback={null}>
        <Spline
          scene={scene}
          renderOnDemand
          onLoad={() => setLoaded(true)}
          className={loaded ? "spline-float-layer__canvas is-loaded" : "spline-float-layer__canvas"}
        />
      </Suspense>
    </div>
  )
}

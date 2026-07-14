/**
 * Spline 3D scene URLs for floating decor.
 *
 * Export from spline.design → Export → Code → React → copy the scene URL.
 * Or download scene.splinecode into public/spline/ and use "/spline/your-scene.splinecode".
 *
 * Env vars (optional):
 *   VITE_SPLINE_FLOAT_SCENE  — one scene with all float objects (best performance)
 *   VITE_SPLINE_STAR_BLUE    — blue star scene
 *   VITE_SPLINE_STAR_GREEN   — green star scene
 */
export const splineScenes = {
  float: import.meta.env.VITE_SPLINE_FLOAT_SCENE ?? "",
  starBlue: import.meta.env.VITE_SPLINE_STAR_BLUE ?? "",
  starGreen: import.meta.env.VITE_SPLINE_STAR_GREEN ?? "",
} as const

export function hasSplineScenes() {
  return Boolean(splineScenes.float || splineScenes.starBlue || splineScenes.starGreen)
}

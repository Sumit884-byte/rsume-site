/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPLINE_FLOAT_SCENE?: string
  readonly VITE_SPLINE_STAR_BLUE?: string
  readonly VITE_SPLINE_STAR_GREEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

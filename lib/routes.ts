export const ROUTES = {
  home: "/",
  app: "/app",
  stage: "/stage",
  docs: "/docs",
  docsInstall: "/docs/getting-started/installation",
  docsStructure: "/docs/getting-started/project-structure",
  docsComponents: "/docs/components",
  docsSample: "/docs/components/pulse-card",
  changelog: "/docs/changelog",
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
} as const

export type RouteKey = keyof typeof ROUTES
export type Route = (typeof ROUTES)[RouteKey]

/** Preview/embed helpers — keep the URL shape in exactly one place. */
export const previewFor = (registryKey: string) => `/preview/${registryKey}`
export const embedFor = (registryKey: string) => `/embed/${registryKey}`
export const registryJsonFor = (name: string) => `/r/${name}.json`

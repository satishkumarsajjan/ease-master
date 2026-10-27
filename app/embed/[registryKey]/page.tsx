import { IframeBridgeProvider } from "@/components/previewer/iframe-bridge-provider"
import { registry } from "@/registry/index"
import { notFound } from "next/navigation"

/**
 * Pre-builds static HTML files for all iframe routes to guarantee instant loading.
 */
export async function generateStaticParams() {
  return Object.keys(registry)
    .filter((key) => registry[key].component)
    .map((registryKey) => ({ registryKey }))
}

/**
 * Renders a completely isolated environment for responsive components.
 * Automatically inherits Dark Mode state if the root `app/layout.tsx` uses a ThemeProvider.
 */
export default async function EmbedPreviewPage(props: {
  params: Promise<{ registryKey: string }>
}) {
  const params = await props.params
  const item = registry[params.registryKey]

  if (!item || !item.component) notFound()

  const ComponentToRender = item.component

  return (
    <IframeBridgeProvider>
      <ComponentToRender />
    </IframeBridgeProvider>
  )
}

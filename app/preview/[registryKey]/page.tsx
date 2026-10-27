import { CodeFile } from "@/components/code-block/types"
import { FullscreenToolbox } from "@/components/previewer/fullscreen-toolbox"
import { registry } from "@/registry/index"
import { notFound, redirect } from "next/navigation"

export async function generateStaticParams() {
  return Object.keys(registry)
    .filter((key) => registry[key].component)
    .map((registryKey) => ({ registryKey }))
}

export default async function DynamicPreviewPage(props: {
  params: Promise<{ registryKey: string }>
}) {
  const params = await props.params
  const item = registry[params.registryKey]

  if (!item) notFound()

  if (!item.component && item.previewUrl) {
    redirect(item.previewUrl)
  }

  if (!item.component) notFound()

  const ComponentToRender = item.component

  let files: Record<string, CodeFile | string> = {}
  if (item.getFiles) {
    files = await item.getFiles()
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
      <FullscreenToolbox
        files={files}
        componentName={item.name}
        installCommand={item.installCommand}
      />

      <div className="relative flex h-full w-full items-center justify-center">
        <ComponentToRender />
      </div>
    </main>
  )
}

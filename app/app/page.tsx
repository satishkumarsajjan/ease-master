import { cookies } from "next/headers"
import { StudioShell } from "@/components/studio/studio-shell"
import { StudioStoreProvider } from "@/store/studio-store-provider"
import { StudioSessionCookie } from "@/components/studio/domain/studio-types"
import { PRODUCT } from "@/lib/config"
import { buildMetadata } from "@/lib/metadata"
import { ROUTES } from "@/lib/routes"

export const metadata = buildMetadata({
  title: "Studio",
  description: `The ${PRODUCT.name} motion curve & spring physics studio.`,
  path: ROUTES.app,
})

export default async function AppPage() {
  const cookieStore = await cookies()
  const rawSession = cookieStore.get("ease_session")?.value
  const rawTimelineOpen = cookieStore.get("ease_timeline_open")?.value

  let initialSession: StudioSessionCookie = {}
  if (rawSession) {
    try {
      initialSession = JSON.parse(decodeURIComponent(rawSession))
    } catch {
      try {
        initialSession = JSON.parse(rawSession)
      } catch {
        // fallback
      }
    }
  }
  if (rawTimelineOpen !== undefined) {
    initialSession.timeline = rawTimelineOpen === "true"
  }

  return (
    <StudioStoreProvider initialSession={initialSession}>
      <StudioShell />
    </StudioStoreProvider>
  )
}

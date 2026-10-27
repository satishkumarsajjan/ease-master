import { EaseWorkstation } from "@/components/ease/workstation"
import { PRODUCT } from "@/lib/config"
import { buildMetadata } from "@/lib/metadata"
import { ROUTES } from "@/lib/routes"

export const metadata = buildMetadata({
  title: "Studio",
  description: `The ${PRODUCT.name} motion curve & spring physics studio.`,
  path: ROUTES.app,
})

export default function AppPage() {
  return <EaseWorkstation />
}

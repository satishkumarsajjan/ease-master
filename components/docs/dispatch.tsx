import { DOCS_LAYOUT } from "@/lib/config"

import { SpatialLayout } from "./layouts/spatial"
import { ThreePaneLayout } from "./layouts/three-pane"
import type { DocsShellProps } from "./types"

/**
 * The ONLY place in `components/` that reads `DOCS_LAYOUT`.
 *
 * The developer picks one shell in `.env.local`; it is baked into the build and
 * visitors cannot change it. Keeping the read here means the choice cannot leak
 * into a layout and quietly reintroduce a runtime switch.
 */
export function DocsShell(props: DocsShellProps) {
  switch (DOCS_LAYOUT) {
    case "three-pane":
      return <ThreePaneLayout {...props} />
    case "spatial":
      return <SpatialLayout {...props} />
    default:
      throw new Error(`docs: unknown DOCS_LAYOUT "${DOCS_LAYOUT}"`)
  }
}

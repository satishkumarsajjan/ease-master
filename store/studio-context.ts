import * as React from "react"
import type { createStudioStore } from "./useStudioStore"

export type StudioStoreApi = ReturnType<typeof createStudioStore>

export const StudioStoreContext = React.createContext<StudioStoreApi | null>(
  null
)

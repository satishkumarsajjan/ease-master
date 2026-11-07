"use client"

import * as React from "react"
import { StudioSessionCookie } from "@/components/studio/domain/studio-types"
import { StudioStoreContext } from "./studio-context"
import {
  createStudioStore,
  setActiveStore,
  syncSessionCookie,
} from "./useStudioStore"

export interface StudioStoreProviderProps {
  initialSession?: StudioSessionCookie
  children: React.ReactNode
}

export function StudioStoreProvider({
  initialSession,
  children,
}: StudioStoreProviderProps) {
  const [store] = React.useState(() => createStudioStore({ initialSession }))

  React.useEffect(() => {
    setActiveStore(store)
    const state = store.getState()
    syncSessionCookie({
      curve: state.activeCurveId,
      engine: state.activeEngine,
      timeline: state.isTimelineOpen,
      scenario: state.activeScenarioKey,
      viewport: state.viewportMode,
      width: state.previewWidth,
      mode: state.mode,
    })
  }, [store])

  return (
    <StudioStoreContext.Provider value={store}>
      {children}
    </StudioStoreContext.Provider>
  )
}

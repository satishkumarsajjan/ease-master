"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Returns true once mounted on client using useSyncExternalStore.
 * Avoids cascading renders and react-hooks/set-state-in-effect warnings in React 19.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

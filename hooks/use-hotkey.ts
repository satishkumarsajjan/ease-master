"use client"

import { useEffect, useRef } from "react"

function parseCombo(keys: string) {
  const parts = keys
    .toLowerCase()
    .split("+")
    .map((part) => part.trim())
  return {
    key: parts[parts.length - 1],
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
  }
}

/** Shared guard: never hijack keys while the user is typing. */
export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

export interface UseHotkeyOptions {
  enabled?: boolean
  /** Call event.preventDefault() — required for "/" and "mod+k". */
  preventDefault?: boolean
}

/**
 * Bind a single shortcut, e.g. useHotkey("mod+k", () => setOpen(true)).
 * Keys are registered in lib/hotkeys.ts first so documentation cannot drift.
 */
export function useHotkey(
  keys: string,
  handler: (event: KeyboardEvent) => void,
  options: UseHotkeyOptions = {}
) {
  const { enabled = true, preventDefault = false } = options
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!enabled) return

    const combo = parseCombo(keys)

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (isTypingTarget(event.target)) return
      if (combo.mod !== (event.metaKey || event.ctrlKey)) return
      if (combo.shift !== event.shiftKey) return
      if (combo.alt !== event.altKey) return
      if (event.key.toLowerCase() !== combo.key) return

      if (preventDefault) event.preventDefault()
      handlerRef.current(event)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [keys, enabled, preventDefault])
}

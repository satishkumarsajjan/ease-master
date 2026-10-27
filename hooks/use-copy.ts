"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { notify } from "@/lib/toast"

export interface UseCopyOptions {
  resetAfter?: number
  /** Fire the brand toast on success. */
  toast?: boolean
  label?: string
}

/** Clipboard + "copied" state (CommandBlock, CodeBlock, CopyMdxButton all roll their own today). */
export function useCopy({
  resetAfter = 2000,
  toast = false,
  label = "Copied",
}: UseCopyOptions = {}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        return false
      }
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetAfter)
      if (toast) notify.copied(label)
      return true
    },
    [resetAfter, toast, label]
  )

  return { copied, copy }
}
